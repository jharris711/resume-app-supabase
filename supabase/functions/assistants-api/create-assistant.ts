import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function createAssistant(
  assistant: OpenAI.Beta.AssistantCreateParams,
) {
  const { instructions, name, tools, model, file_ids } = assistant;

  const createdAssistant = await openai.beta.assistants.create({
    instructions,
    name,
    tools,
    model,
    file_ids,
  });

  return new Response(JSON.stringify({ assistant: createdAssistant }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
