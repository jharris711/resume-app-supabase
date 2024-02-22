import OpenAI from "openai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

async function CreateOpenaiAssistantHandler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { file_id } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const assistant = await openai.beta.assistants.create({
      name: "Resume Assistant",
      description:
        "As a Resume Assistant, your mission is to assist users in refining their resumes for job applications. You're tasked with analyzing resumes to suggest improvements, tailoring content to align with job descriptions, offering guidance on effective writing and formatting, and answering queries related to resume optimization. Maintain a professional yet supportive tone throughout interactions, focusing on providing actionable advice.",
      model: "gpt-4-turbo-preview",
      tools: [{ "type": "code_interpreter" }],
      file_ids: [file_id],
    });

    return new Response(JSON.stringify(assistant), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Return error message
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}

Deno.serve(CreateOpenaiAssistantHandler);
