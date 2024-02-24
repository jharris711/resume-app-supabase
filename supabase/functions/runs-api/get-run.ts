import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread_id: OpenAI.Beta.Thread["id"];
  run_id: OpenAI.Beta.Threads.Run["id"];
}

export async function getRun({ thread_id, run_id }: Props) {
  const run = await openai.beta.threads.runs.retrieve(
    thread_id,
    run_id,
  );

  if (!run) throw new Error("Run not found");

  return new Response(JSON.stringify({ run }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
