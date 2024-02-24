import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function getAllMessages(thread_id: OpenAI.Beta.Thread["id"]) {
  const threadMessages = await openai.beta.threads.messages.list(thread_id);

  return new Response(JSON.stringify({ messages: threadMessages.data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
