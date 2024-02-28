import { createClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

import { createResume } from "./create-resume.ts";
import { deleteResume } from "./delete-resume.ts";
import { getResume } from "./get-resume.ts";
import { listResumes } from "./list-resumes.ts";

const PATHNAME = "/resumes-api/:id";
const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};

async function resumesApi(req: Request) {
  const { url, method } = req;

  if (method === methods.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const resumePattern = new URLPattern({
      pathname: PATHNAME,
    });
    const matchingPath = resumePattern.exec(url);
    const id = matchingPath ? matchingPath.pathname.groups.id : null;

    let resume_file = null;
    let user_id = null;
    if (method === methods.POST) {
      const body = await req.formData();
      resume_file = body.get("file") as File;
      user_id = body.get("user_id") as string;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === methods.GET:
        return getResume({
          supabaseClient,
          id: id as string,
        });
      case id && method === methods.DELETE:
        return deleteResume({
          supabaseClient,
          id: id as string,
        });
      case method === methods.POST: {
        if (!resume_file) throw new Error("No file provided");
        if (!user_id) throw new Error("No User ID provided");

        return createResume({
          supabaseClient,
          resume_file,
          user_id,
        });
      }
      case method === methods.GET:
        return listResumes(supabaseClient);
      default:
        return listResumes(supabaseClient);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}

Deno.serve(resumesApi);
