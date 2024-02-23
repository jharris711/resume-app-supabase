import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function createThread(thread: OpenAI.Beta.ThreadCreateParams) {
  const { messages, metadata } = thread;

  const createdThread = await openai.beta.threads.create({
    messages,
    metadata,
  });

  return new Response(JSON.stringify({ assistant: createdThread }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
