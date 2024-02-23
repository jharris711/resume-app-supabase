import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function createMessage(
  thread_id: OpenAI.Beta.Thread["id"],
  message: OpenAI.Beta.Threads.MessageCreateParams,
) {
  const createdMessage = await openai.beta.threads.messages.create(
    thread_id,
    message,
  );

  return new Response(JSON.stringify({ message: createdMessage }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
