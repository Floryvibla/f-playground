import { fetchperplexityStream } from "@/lib/perplexity-fake";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const content = searchParams.get("content");
  if (!content) {
    return Response.json({ error: "Precisa de content" }, { status: 500 });
  }
  try {
    const response = await fetchperplexityStream(content);
    return Response.json({
      response: response,
    });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
