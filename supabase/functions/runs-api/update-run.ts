import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread_id: OpenAI.Beta.Thread["id"];
  run_id: OpenAI.Beta.Threads.Run["id"];
  run: OpenAI.Beta.Threads.Run;
}

export async function updateRun({ thread_id, run_id, run }: Props) {
  const updatedRun = await openai.beta.threads.runs.update(
    thread_id,
    run_id,
    run,
  );

  if (!updatedRun) throw new Error("Error updating run");

  return new Response(JSON.stringify({ updatedRun }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
