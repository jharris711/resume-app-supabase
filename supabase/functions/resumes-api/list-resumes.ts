import { SupabaseClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

const RESUMES_TABLE = "resumes";

export async function listResumes(supabaseClient: SupabaseClient) {
  const { data: resumes, error } = await supabaseClient.from(RESUMES_TABLE)
    .select("*");
  if (error) throw error;

  return new Response(JSON.stringify({ resumes }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
