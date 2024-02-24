import { corsHeaders } from "../_shared/cors-headers.ts";

import { getAssistant } from "./get-assistant.ts";
import { updateAssistant } from "./update-assistant.ts";
import { deleteAssistant } from "./delete-assistant.ts";
import { createAssistant } from "./create-assistant.ts";
import { getAllAssistants } from "./get-all-assistants.ts";

const PATHNAME = "/assistants-api/:id";
const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

async function assistantsApi(req: Request) {
  const { url, method } = req;

  if (method === methods.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const assistantPattern = new URLPattern({
      pathname: PATHNAME,
    });
    const matchingPath = assistantPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let assistant = null;
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      assistant = body.assistant;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getAssistant(id as string);
      case id && method === methods.PUT:
        return updateAssistant({
          id: id as string,
          assistant,
        });
      case id && method === methods.DELETE:
        return deleteAssistant(id as string);
      case method === methods.POST:
        return createAssistant(assistant);
      case method === methods.GET:
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
