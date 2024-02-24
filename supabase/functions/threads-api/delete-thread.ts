import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function deleteThread(id: OpenAI.Beta.Thread["id"]) {
  const response = await openai.beta.threads.del(id);

  return new Response(JSON.stringify({ response }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
