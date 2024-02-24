import { corsHeaders } from "../_shared/cors-headers.ts";

import { cancelRun } from "./cancel-run.ts";
import { createRun } from "./create-run.ts";
import { getRun } from "./get-run.ts";
import { listRuns } from "./list-runs.ts";
import { updateRun } from "./update-run.ts";

const pathnames = {
  withID: "/runs-api/:thread_id/:id",
  withoutID: "/runs-api/:thread_id",
};
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

    let run = null;
    if (method === methods.POST || method === methods.PUT) {
      const body = await req.json();
      run = body.run;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getRun({
          thread_id: thread_id as string,
          run_id: id as string,
        });
      case id && method === methods.PUT:
        return updateRun({
          thread_id: thread_id as string,
          run_id: id as string,
          run,
        });
      case id && method === methods.POST:
        return cancelRun({
          thread_id: thread_id as string,
          run_id: id as string,
        });
      case method === methods.POST:
        return createRun({
          thread_id: thread_id as string,
          run,
        });
      case method === methods.GET:
        return listRuns(thread_id as string);
      default:
        return listRuns(thread_id as string);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}

Deno.serve(runsApi);
