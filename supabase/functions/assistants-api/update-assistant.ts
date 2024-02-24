import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

interface Props {
  id: string;
  assistant: OpenAI.Beta.AssistantUpdateParams;
}

export async function updateAssistant(
  { id, assistant }: Props,
) {
  const { instructions, name, tools, model, file_ids } = assistant;

  const updatedAssistant = await openai.beta.assistants.update(
    id,
    {
      instructions,
      name,
      tools,
      model,
      file_ids,
    },
  );

  if (!updatedAssistant) throw new Error("Assistant not found");

  return new Response(JSON.stringify({ assistant: updatedAssistant }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
