import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Data Collector Edge Function
 * 
 * Receives raw event data from external sources (website tracking snippet,
 * Shopify webhooks, GA4, email/WhatsApp providers) and writes them into
 * the `events` table. Also ensures the `customers` record exists.
 *
 * POST body:
 * {
 *   "user_id": "uuid",           // the SMB tenant
 *   "customer_email": "...",     // required to identify/create customer
 *   "customer_name": "...",      // optional
 *   "customer_phone": "...",     // optional
 *   "source": "website",        // 'website' | 'email' | 'whatsapp' | 'ga4'
 *   "event_type": "page_view",  // 'page_view' | 'add_to_cart' | 'purchase' | 'email_open' | 'email_click' | 'wa_read' | 'wa_reply' | 'cart_abandon' | 'product_view'
 *   "properties": { ... },      // arbitrary JSON (product_id, amount, page_url, etc.)
 *   "occurred_at": "ISO string" // optional, defaults to now()
 * }
 *
 * Can also accept an array of events for batch ingestion.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();

    // Support single event or batch array
    const events = Array.isArray(body) ? body : [body];

    if (events.length === 0) {
      return new Response(JSON.stringify({ error: "No events provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let errors: string[] = [];

    for (const event of events) {
      try {
        const {
          user_id,
          customer_email,
          customer_name,
          customer_phone,
          source,
          event_type,
          properties,
          occurred_at,
        } = event;

        // Validate required fields
        if (!user_id || !customer_email || !source || !event_type) {
          errors.push(
            `Missing required fields for event: ${JSON.stringify({ user_id, customer_email, source, event_type })}`
          );
          continue;
        }

        // Step 1: Upsert customer (find by email + user_id, create if not exists)
        let customerId: string;

        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", user_id)
          .eq("email", customer_email)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: insertError } = await supabase
            .from("customers")
            .insert({
              user_id,
              email: customer_email,
              name: customer_name || null,
              phone: customer_phone || null,
            })
            .select("id")
            .single();

          if (insertError || !newCustomer) {
            errors.push(
              `Failed to create customer ${customer_email}: ${insertError?.message}`
            );
            continue;
          }
          customerId = newCustomer.id;
        }

        // Step 2: Insert event
        const { error: eventError } = await supabase.from("events").insert({
          customer_id: customerId,
          user_id,
          source,
          event_type,
          properties: properties || {},
          occurred_at: occurred_at || new Date().toISOString(),
        });

        if (eventError) {
          errors.push(
            `Failed to insert event for ${customer_email}: ${eventError.message}`
          );
          continue;
        }

        // Step 3: Update integration events_today counter
        await supabase.rpc("increment_integration_events", {
          p_user_id: user_id,
          p_type: source,
        });

        processed++;
      } catch (e) {
        errors.push(`Event processing error: ${e.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed}/${events.length} events`,
        processed,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: errors.length > 0 && processed === 0 ? 400 : 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
