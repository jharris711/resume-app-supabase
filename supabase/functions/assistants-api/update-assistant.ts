import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

type Assistant = {
  id: string;
  model?: string;
  name?: string | null;
  description?: string | null;
  instructions?: string | null;
  tools?: [];
  file_ids?: string[];
  metadata?: Map<string, string>;
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export async function updateAssistant(assistant: Assistant) {
  const { id, instructions, name, tools, model, file_ids } = assistant;

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
