import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * n8n Webhook Bridge Edge Function
 *
 * When an automation is published (status = "active"), this function
 * reads the automation config and registers/triggers an n8n workflow
 * via the n8n API.
 *
 * POST body:
 * {
 *   "automation_id": "uuid"    // the automation that was just published
 * }
 *
 * It reads the automation from DB, maps the trigger + actions to an n8n
 * workflow definition, and either creates or updates an n8n workflow.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const N8N_BASE_URL = Deno.env.get("N8N_BASE_URL") || "http://localhost:5678";
    const N8N_API_KEY = Deno.env.get("N8N_API_KEY");

    if (!N8N_API_KEY) {
      throw new Error("N8N_API_KEY is not set. Configure it in Supabase secrets.");
    }

    const { automation_id } = await req.json();
    if (!automation_id) {
      throw new Error("automation_id is required");
    }

    // Step 1: Fetch the automation config from DB
    const { data: automation, error: fetchError } = await supabase
      .from("automations")
      .select("*")
      .eq("id", automation_id)
      .single();

    if (fetchError || !automation) {
      throw new Error(`Automation not found: ${fetchError?.message}`);
    }

    // Step 2: Build an n8n workflow definition from the automation
    const triggerMap: Record<string, string> = {
      cart_abandon: "Cart Abandoned",
      reorder_reminder: "Reorder Reminder",
      welcome_series: "Welcome Series",
      win_back: "Win-Back Campaign",
      post_purchase: "Post-Purchase Follow-up",
    };

    const channelNodeMap: Record<string, any> = {
      email: {
        type: "n8n-nodes-base.emailSend",
        typeVersion: 1,
        name: "Send Email",
        parameters: {
          fromEmail: "noreply@lifecycle.io",
          toEmail: "={{ $json.customer_email }}",
          subject: automation.name || "Lifecycle Message",
          text: "This is an automated message from Lifecycle.",
        },
      },
      whatsapp: {
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 3,
        name: "Send WhatsApp",
        parameters: {
          url: "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages",
          method: "POST",
          headers: {
            Authorization: "Bearer WHATSAPP_TOKEN",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: "{{ $json.customer_phone }}",
            type: "text",
            text: { body: automation.name || "Lifecycle Message" },
          }),
        },
      },
    };

    const triggerLabel = triggerMap[automation.trigger_type] || automation.trigger_type;
    const channel = automation.channel || "email";
    const channelNode = channelNodeMap[channel] || channelNodeMap.email;

    // n8n workflow structure
    const workflowPayload = {
      name: `Lifecycle: ${automation.name || triggerLabel}`,
      active: automation.status === "active",
      nodes: [
        {
          name: "Webhook Trigger",
          type: "n8n-nodes-base.webhook",
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            path: `lifecycle-${automation_id}`,
            httpMethod: "POST",
          },
        },
        {
          ...channelNode,
          position: [500, 300],
        },
      ],
      connections: {
        "Webhook Trigger": {
          main: [[{ node: channelNode.name, type: "main", index: 0 }]],
        },
      },
    };

    // Step 3: Create the workflow in n8n
    const n8nResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": N8N_API_KEY,
      },
      body: JSON.stringify(workflowPayload),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      throw new Error(`n8n API error: ${n8nResponse.status} - ${errText}`);
    }

    const n8nWorkflow = await n8nResponse.json();

    // Step 4: Store the n8n workflow ID back in the automation record
    await supabase
      .from("automations")
      .update({
        status: "active",
        // Store the n8n workflow reference in the config
        config: {
          ...(automation.config || {}),
          n8n_workflow_id: n8nWorkflow.id,
          n8n_webhook_url: `${N8N_BASE_URL}/webhook/lifecycle-${automation_id}`,
        },
      })
      .eq("id", automation_id);

    return new Response(
      JSON.stringify({
        message: `Workflow "${workflowPayload.name}" created in n8n`,
        n8n_workflow_id: n8nWorkflow.id,
        webhook_url: `${N8N_BASE_URL}/webhook/lifecycle-${automation_id}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
