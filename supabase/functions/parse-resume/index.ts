import { createClient } from "supabase";
import * as pdfjsLib from "pdfjsDist";
import * as worker from "pdfjsWorker";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

async function ParseResumeHandler(req: Request) {
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

    // Set PDFjs worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

    const { file_name } = await req.json();

    // Download resume from Supabase storage
    const { data, error } = await supabaseClient
      .storage
      .from("resumes")
      .download(file_name);

    if (error) throw error;

    // Parse PDF
    const arrayBuffer = await data.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let contents = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      // deno-lint-ignore no-explicit-any
      contents += textContent.items.map((item: any) => item.str).join(" ");
    }

    // Return extracted text
    return new Response(JSON.stringify({ contents }), {
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
}

Deno.serve(ParseResumeHandler);
