import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function getMessage(
  thread_id: OpenAI.Beta.Thread["id"],
  id: string,
) {
  const message = await openai.beta.threads.messages.retrieve(thread_id, id);

  if (!message) throw new Error("Message not found");

  return new Response(JSON.stringify({ message }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
