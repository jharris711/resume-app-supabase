import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread_id: OpenAI.Beta.Thread["id"];
  id: string;
  message: OpenAI.Beta.Threads.MessageUpdateParams;
}

export async function updateMessage({ thread_id, id, message }: Props) {
  const updatedMessage = await openai.beta.threads.messages.update(
    thread_id,
    id,
    message,
  );

  if (!updatedMessage) throw new Error("Message not found");

  return new Response(JSON.stringify({ updatedMessage }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
