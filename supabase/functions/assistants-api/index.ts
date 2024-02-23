import { corsHeaders } from "./cors-headers.ts";
import { getAssistant } from "./get-assistant.ts";
import { updateAssistant } from "./update-assistant.ts";
import { deleteAssistant } from "./delete-assistant.ts";
import { createAssistant } from "./create-assistant.ts";
import { getAllAssistants } from "./get-all-assistants.ts";

async function assistantsApi(req: Request) {
  const { url, method } = req;

  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const assistantPattern = new URLPattern({
      pathname: "/assistants-api/:id",
    });
    const matchingPath = assistantPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let assistant = null;
    if (method === "POST" || method === "PUT") {
      const body = await req.json();
      assistant = body.assistant;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === "GET":
        return getAssistant(id as string);
      case id && method === "PUT":
        return updateAssistant(assistant);
      case id && method === "DELETE":
        return deleteAssistant(id as string);
      case method === "POST":
        return createAssistant(assistant);
      case method === "GET":
        return getAllAssistants();
      default:
        return getAllAssistants();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}

Deno.serve(assistantsApi);
