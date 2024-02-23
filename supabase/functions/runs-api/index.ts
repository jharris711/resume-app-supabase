import { corsHeaders } from "./cors-headers.ts";

const PATHNAME = "/runs-api/:id";
const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

async function runsApi(req: Request) {
  const { url, method } = req;

  if (method === methods.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const runPattern = new URLPattern({
      pathname: PATHNAME,
    });
    const matchingPath = runPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let run = null;
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      run = body.run;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getAssistant(id as string);
      case id && method === methods.PUT:
        return updateAssistant(id as string, run);
      case id && method === methods.DELETE:
        return deleteAssistant(id as string);
      case method === methods.POST:
        return createAssistant(run);
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

Deno.serve(runsApi);
