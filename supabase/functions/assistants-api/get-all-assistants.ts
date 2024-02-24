import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function getAllAssistants() {
  const assistants = await openai.beta.assistants.list({
    order: "desc",
    limit: 20,
  });

  return new Response(JSON.stringify({ assistants }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
