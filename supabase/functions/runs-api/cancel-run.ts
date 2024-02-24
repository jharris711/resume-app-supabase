import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread_id: OpenAI.Beta.Thread["id"];
  run_id: OpenAI.Beta.Threads.Run["id"];
}

export async function cancelRun({ thread_id, run_id }: Props) {
  const canceledRun = await openai.beta.threads.runs.cancel(
    thread_id,
    run_id,
  );

  if (!canceledRun) throw new Error("Error canceling run");

  return new Response(JSON.stringify({ canceledRun }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
