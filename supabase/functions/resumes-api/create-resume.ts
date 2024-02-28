import { SupabaseClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

interface Props {
  supabaseClient: SupabaseClient;
  resume_file: File;
  user_id: string;
}

const RESUMES_BUCKET = "resumes";
const RESUMES_TABLE = "resumes";

export async function createResume(
  { supabaseClient, resume_file, user_id }: Props,
) {
  // Store the file in Resumes bucket
  const { data: storedFile, error: storeFileError } = await supabaseClient
    .storage
    .from(RESUMES_BUCKET)
    .upload(resume_file.name, resume_file, {
      cacheControl: "3600",
      upsert: false,
    });

  console.log("storeFileError", storeFileError);
  if (storeFileError) throw storeFileError;

  // Create a resume object for DB
  const resume = {
    /* @ts-ignore */
    file_id: storedFile.id,
    /* @ts-ignore */
    file_path: storedFile.fullPath,
    file_name: storedFile.path,
    updated_at: new Date(Date.now()).toISOString(),
    user_id: user_id,
  };

  // Save resume to DB
  const { data, error } = await supabaseClient
    .from(RESUMES_TABLE)
    .upsert(resume)
    .select();

  console.log("error", error);
  if (error) throw error;

  return new Response(JSON.stringify({ resume: data[0] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
