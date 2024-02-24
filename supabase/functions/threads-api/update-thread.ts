import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  id: string;
  thread: OpenAI.Beta.ThreadUpdateParams;
}

export async function updateThread({
  id,
  thread,
}: Props) {
  const updatedThread = await openai.beta.threads.update(
    id,
    thread,
  );

  if (!updatedThread) throw new Error("Thread not found");

  return new Response(JSON.stringify({ thread: updatedThread }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
