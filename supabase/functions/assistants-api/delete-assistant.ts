import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function deleteAssistant(id: string) {
  const response = await openai.beta.assistants.del(id);

  return new Response(JSON.stringify({ response }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
