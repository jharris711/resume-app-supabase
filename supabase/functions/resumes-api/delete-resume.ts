import { SupabaseClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

interface Props {
  supabaseClient: SupabaseClient;
  id: string;
}

const RESUMES_BUCKET = "resumes";
const RESUMES_TABLE = "resumes";

export async function deleteResume({ supabaseClient, id }: Props) {
  const { data: getResumeResponse, error: getResumeError } =
    await supabaseClient
      .from(
        RESUMES_TABLE,
      )
      .select(
        "*",
      )
      .eq("id", id);

  if (getResumeError) throw getResumeError;

  const resume = getResumeResponse[0];

  const { error: deleteResumeError } = await supabaseClient
    .from(RESUMES_TABLE)
    .delete()
    .eq("id", id);

  if (deleteResumeError) throw deleteResumeError;

  const { error: removeResumeError } = await supabaseClient
    .storage
    .from(RESUMES_BUCKET)
    .remove([`resumes/${resume.file_name}`]);

  if (removeResumeError) throw removeResumeError;

  return new Response("Resume Deleted", {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
