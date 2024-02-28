import { SupabaseClient } from "supabase";

import { corsHeaders } from "../_shared/cors-headers.ts";

const RESUMES_TABLE = "resumes";

interface Props {
  supabaseClient: SupabaseClient;
  id: string;
}

export async function getResume({ supabaseClient, id }: Props) {
  const { data: resume, error } = await supabaseClient.from(RESUMES_TABLE)
    .select(
      "*",
    )
    .eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({ resume }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
