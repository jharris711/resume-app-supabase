import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function updateThread(
  id: string,
  thread: OpenAI.Beta.ThreadUpdateParams,
) {
  const { metadata } = thread;

  const updatedThread = await openai.beta.threads.update(
    id,
    {
      metadata,
    },
  );

  if (!updatedThread) throw new Error("Thread not found");

  return new Response(JSON.stringify({ thread: updatedThread }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
