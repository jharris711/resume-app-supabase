import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function getThread(id: OpenAI.Beta.Thread["id"]) {
  const thread = await openai.beta.threads.retrieve(id);

  if (!thread) throw new Error("Thread not found");

  return new Response(JSON.stringify({ thread }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
