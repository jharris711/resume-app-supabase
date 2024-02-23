import { corsHeaders } from "./cors-headers.ts";
import { createMessage } from "./create-message.ts";
import { getAllMessages } from "./get-all-messages.ts";
import { getMessage } from "./get-message.ts";
import { updateMessage } from "./update-message.ts";

const PATHNAME = "/messages-api/:thread_id/:id";
const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

async function messagesApi(req: Request) {
  const { url, method } = req;

  if (method === methods.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const messagesPattern = new URLPattern({
      pathname: PATHNAME,
    });
    const matchingPath = messagesPattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;
    const thread_id = matchingPath
      ? matchingPath.pathname.groups.thread_id
      : null;

    let message = null;
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      message = body.message;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getMessage(thread_id as string, id as string);
      case id && method === methods.PUT:
        return updateMessage(thread_id as string, id as string, message);
      case id && method === methods.DELETE:
        return new Response(
          "No delete method for messages. Try updating the message to be blank or delete the thread.",
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      case method === methods.POST:
        return createMessage(thread_id as string, message);
      case method === methods.GET:
        return getAllMessages(thread_id as string);
      default:
        return new Response(
          "This is the default response and you shouldn't have reached it. Check the ID and method and try again.",
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

Deno.serve(messagesApi);
