import { SupabaseClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

interface Props {
  supabaseClient: SupabaseClient;
  id: string;
}

const RESUMES_BUCKET = "resumes";
const RESUMES_TABLE = "resumes";

export async function deleteResume({ supabaseClient, id }: Props) {
  console.log("id", id);
  const { data: getResumeResponse, error: getResumeError } =
    await supabaseClient
      .from(
        RESUMES_TABLE,
      )
      .select(
        "*",
      )
      .eq("id", id);

  console.log("getResumeResponse", getResumeResponse);

  if (getResumeError) throw getResumeError;

  const resume = getResumeResponse[0];

  console.log("resume", resume);

  const { data: deleteResumeResponse, error: deleteResumeError } =
    await supabaseClient
      .from(RESUMES_TABLE)
      .delete()
      .eq("id", id);

  console.log("deleteResumeResponse", deleteResumeResponse);

  if (deleteResumeError) throw deleteResumeError;

  const { data: removeResumeResponse, error: removeResumeError } =
    await supabaseClient
      .storage
      .from(RESUMES_BUCKET)
      .remove([`resumes/${resume.file_name}`]);

  console.log("removeResumeResponse", removeResumeResponse);

  if (removeResumeError) throw removeResumeError;

  return new Response("Resume Deleted", {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
