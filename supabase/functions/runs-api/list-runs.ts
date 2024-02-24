import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function listRuns(thread_id: OpenAI.Beta.Thread["id"]) {
  const runs = await openai.beta.threads.runs.list(
    thread_id,
  );

  return new Response(JSON.stringify({ runs: runs.data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
