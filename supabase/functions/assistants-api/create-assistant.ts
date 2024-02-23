import OpenAI from "openai";

import { corsHeaders } from "./cors-headers.ts";

type Assistant = {
  model: string;
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

export async function createAssistant(assistant: Assistant) {
  console.log("assistant", assistant);
  const { instructions, name, tools, model, file_ids } = assistant;

  console.log(instructions, name, tools, model, file_ids);

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
