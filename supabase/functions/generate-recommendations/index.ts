import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CustomerSegmentSummary {
  stage: string;
  count: number;
  avg_engagement: number;
  avg_churn_risk: number;
  avg_days_since_purchase: number;
  avg_ltv: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    // Step 1: Aggregate customer_metrics by lifecycle_stage
    const { data: metricsRows, error: metricsError } = await supabase
      .from("customer_metrics")
      .select(
        "lifecycle_stage, engagement_score, churn_risk_score, days_since_last_purchase, total_lifetime_value"
      );

    if (metricsError) throw metricsError;

    // Group by lifecycle stage
    const stageMap = new Map<string, CustomerSegmentSummary>();
    for (const row of metricsRows || []) {
      const stage = row.lifecycle_stage || "unknown";
      if (!stageMap.has(stage)) {
        stageMap.set(stage, {
          stage,
          count: 0,
          avg_engagement: 0,
          avg_churn_risk: 0,
          avg_days_since_purchase: 0,
          avg_ltv: 0,
        });
      }
      const s = stageMap.get(stage)!;
      s.count++;
      s.avg_engagement += row.engagement_score || 0;
      s.avg_churn_risk += row.churn_risk_score || 0;
      s.avg_days_since_purchase += row.days_since_last_purchase || 0;
      s.avg_ltv += Number(row.total_lifetime_value) || 0;
    }

    // Calculate averages
    const segmentSummaries: CustomerSegmentSummary[] = [];
    for (const s of stageMap.values()) {
      if (s.count > 0) {
        s.avg_engagement = Math.round(s.avg_engagement / s.count);
        s.avg_churn_risk = Math.round(s.avg_churn_risk / s.count);
        s.avg_days_since_purchase = Math.round(
          s.avg_days_since_purchase / s.count
        );
        s.avg_ltv = Math.round(s.avg_ltv / s.count);
      }
      segmentSummaries.push(s);
    }

    // Step 2: Get recent campaign performance
    const { data: recentCampaigns } = await supabase
      .from("campaign_sends")
      .select("channel, sent_count, delivered, opened, clicked, revenue")
      .order("created_at", { ascending: false })
      .limit(10);

    // Step 3: Build prompt for Claude
    const prompt = `You are a marketing strategist for an e-commerce SMB platform. Based on the following customer segment data and recent campaign performance, generate 4-6 specific, actionable marketing recommendations.

## Customer Segments:
${JSON.stringify(segmentSummaries, null, 2)}

## Recent Campaign Performance (last 10 sends):
${JSON.stringify(recentCampaigns || [], null, 2)}

For each recommendation, provide:
1. "title": A concise action-oriented title (max 80 chars)
2. "explanation": 2-3 sentences explaining why this action matters and what data supports it
3. "target_segment": Which lifecycle stage this targets (new, active, champion, at_risk, dormant)
4. "suggested_channel": "email" or "whatsapp" - which channel would be most effective
5. "suggested_action": A specific action the business owner should take
6. "expected_impact": A brief expected outcome (e.g., "Recover 15-20% of at-risk customers")
7. "priority": A number from 0-100 indicating urgency (100 = most urgent)

Return ONLY a JSON array of recommendation objects. No markdown, no explanation outside the JSON.`;

    // Step 4: Call Claude API
    const claudeResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errText}`);
    }

    const claudeData = await claudeResponse.json();
    const responseText =
      claudeData.content?.[0]?.text || "[]";

    // Parse recommendations from Claude's response
    let recommendations: any[];
    try {
      recommendations = JSON.parse(responseText);
    } catch {
      // Try to extract JSON array from the response
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        recommendations = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse Claude response as JSON");
      }
    }

    // Step 5: Get user_id (for now use the first user we find)
    const { data: firstCustomer } = await supabase
      .from("customers")
      .select("user_id")
      .limit(1)
      .single();

    const userId = firstCustomer?.user_id;
    if (!userId) {
      throw new Error("No customers found — cannot determine user_id");
    }

    // Step 6: Clear old pending recommendations and insert new ones
    await supabase
      .from("recommendations")
      .delete()
      .eq("user_id", userId)
      .eq("status", "pending");

    const rows = recommendations.map((r: any) => ({
      user_id: userId,
      title: r.title,
      explanation: r.explanation,
      target_segment: r.target_segment,
      suggested_channel: r.suggested_channel,
      suggested_action: r.suggested_action,
      expected_impact: r.expected_impact,
      priority: r.priority,
      status: "pending",
    }));

    const { error: insertError } = await supabase
      .from("recommendations")
      .insert(rows);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        message: `Generated ${recommendations.length} recommendations`,
        recommendations,
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
