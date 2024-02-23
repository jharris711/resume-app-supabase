import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function getAssistant(id: string) {
  const assistant = await openai.beta.assistants.retrieve(id);

  if (!assistant) throw new Error("Assistant not found");

  return new Response(JSON.stringify({ assistant }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
