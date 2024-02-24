import { corsHeaders } from "../_shared/cors-headers.ts";

import { createMessage } from "./create-message.ts";
import { getAllMessages } from "./get-all-messages.ts";
import { getMessage } from "./get-message.ts";
import { updateMessage } from "./update-message.ts";

const pathnames = {
  withID: "/messages-api/:thread_id/:id",
  withoutID: "/messages-api/:thread_id",
};

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
    const patternWithId = new URLPattern({
      pathname: pathnames.withID,
    });
    const patternWithoutId = new URLPattern({
      pathname: pathnames.withoutID,
    });

    const matchingPathWithId = patternWithId.exec(url);
    const matchingPathWithoutId = patternWithoutId.exec(url);

    let thread_id, id;
    if (matchingPathWithId) {
      thread_id = matchingPathWithId.pathname.groups.thread_id;
      id = matchingPathWithId.pathname.groups.id;
    } else if (matchingPathWithoutId) {
      thread_id = matchingPathWithoutId.pathname.groups.thread_id;
      id = null; // id is optional, so it's okay if it's not there
    }

    let message = null;
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      message = body.message;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getMessage({
          thread_id: thread_id as string,
          id: id as string,
        });
      case id && method === methods.PUT:
        return updateMessage({
          thread_id: thread_id as string,
          id: id as string,
          message,
        });
      case id && method === methods.DELETE:
        return new Response(
          "No delete method for messages. Try updating the message to be blank or delete the thread.",
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      case method === methods.POST:
        return createMessage({
          thread_id: thread_id as string,
          message,
        });
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
