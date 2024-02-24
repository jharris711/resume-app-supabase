import { corsHeaders } from "./cors-headers.ts";
import { createThread } from "./create-thread.ts";
import { deleteThread } from "./delete-thread.ts";
import { getThread } from "./get-thread.ts";
import { updateThread } from "./update-thread.ts";

const PATHNAME = "/threads-api/:id";
const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

async function threadsApi(req: Request) {
  const { url, method } = req;

  if (method === methods.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const threadPattern = new URLPattern({
      pathname: PATHNAME,
    });
    const matchingPath = threadPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let thread = {};
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      if (body.thread) {
        thread = body.thread;
      }
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getThread(id as string);
      case id && method === methods.PUT:
        return updateThread({
          id: id as string,
          thread,
        });
      case id && method === methods.DELETE:
        return deleteThread(id as string);
      case method === methods.POST:
        return createThread(thread);
      case method === methods.GET:
        return new Response(
          "No GET - List all. Try searching for a specific thread.",
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      default:
        return new Response(
          "This is the default option and you shouldn't have reached it. Check the ID and method and try again.",
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}

Deno.serve(threadsApi);
