import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { built_up_area, floors, timeline_weeks, wage_rate, cost_per_sq_yard, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a construction planning AI. Analyze this project and provide a detailed structured analysis.

Project Parameters:
- Built-up Area: ${built_up_area} sq. yards
- Number of Floors: ${floors}
- Timeline: ${timeline_weeks} weeks
- Wage Rate: ₹${wage_rate}/day
- Cost per Sq. Yard: ₹${cost_per_sq_yard}
- Budget: ₹${budget}

Provide a comprehensive analysis in this exact JSON format:
{
  "total_estimated_cost": <number in INR>,
  "cost_breakdown": {
    "foundation": <number>,
    "structure": <number>,
    "finishing": <number>,
    "electrical": <number>,
    "plumbing": <number>,
    "labor": <number>,
    "miscellaneous": <number>
  },
  "materials": [
    {"name": "Cement", "quantity": "<amount with unit>", "estimated_cost": <number>},
    {"name": "Steel", "quantity": "<amount with unit>", "estimated_cost": <number>},
    {"name": "Bricks", "quantity": "<amount with unit>", "estimated_cost": <number>},
    {"name": "Sand", "quantity": "<amount with unit>", "estimated_cost": <number>},
    {"name": "Aggregate", "quantity": "<amount with unit>", "estimated_cost": <number>}
  ],
  "workers": {
    "masons": <number>,
    "helpers": <number>,
    "electricians": <number>,
    "plumbers": <number>,
    "carpenters": <number>,
    "total": <number>
  },
  "weekly_schedule": [
    {"week": "1-2", "phase": "Foundation", "tasks": ["Excavation", "PCC", "Footing"]},
    {"week": "3-6", "phase": "Structure", "tasks": ["Columns", "Beams", "Slab casting"]},
    {"week": "7-10", "phase": "Finishing", "tasks": ["Plastering", "Flooring", "Painting"]},
    {"week": "11-12", "phase": "Final", "tasks": ["Electrical", "Plumbing", "Handover"]}
  ],
  "budget_status": "<within budget / over budget by X%>",
  "optimization_tips": ["tip1", "tip2", "tip3"],
  "summary": "<2-3 sentence project summary>"
}

Use realistic Indian construction costs and standards. Respond ONLY with valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a construction cost estimation AI. Return ONLY valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Try to parse JSON from the response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = content;
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-planner error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
