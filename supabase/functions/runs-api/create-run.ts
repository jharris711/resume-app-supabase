import OpenAI from "openai";

import { corsHeaders } from "../_shared/cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  thread_id: OpenAI.Beta.Thread["id"];
  run: OpenAI.Beta.Threads.Run;
}

export async function createRun({ thread_id, run }: Props) {
  const createdRun = await openai.beta.threads.runs.create(
    thread_id,
    run,
  );

  return new Response(JSON.stringify({ message: createdRun }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
