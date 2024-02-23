import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread?: OpenAI.Beta.ThreadCreateParams;
}

export async function createThread({ thread }: Props) {
  const createdThread = await openai.beta.threads.create(
    thread,
  );

  return new Response(JSON.stringify({ thread: createdThread }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
