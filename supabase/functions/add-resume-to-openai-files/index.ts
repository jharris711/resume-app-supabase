import { createClient } from "supabase";
import OpenAI from "openai";
import { FileLike } from "https://deno.land/x/openai@v4.28.0/uploads.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
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

    const { file_name } = await req.json();

    // Download resume from Supabase storage
    const { data: fileBlob, error } = await supabaseClient
      .storage
      .from("resumes")
      .download(file_name);

    if (error) throw error;

    // Create a FileLike object from the Blob
    const fileLike: FileLike = {
      ...fileBlob, // Spread the Blob properties to cover the BlobLike part
      name: file_name, // Use the file name from your context
      lastModified: Date.now(), // Use the current timestamp or fetch this from storage metadata if available
    };

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const file = await openai.files.create({
      file: fileLike,
      purpose: "assistants",
    });

    // Return file from openai
    return new Response(JSON.stringify({ file }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Return error message
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-resume-to-openai-files' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
