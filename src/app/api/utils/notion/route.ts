import { notionLib } from "@/lib/notion";

export async function GET() {
  try {
    const database = await notionLib.createPageDatabase({
      database_id: "16de28dda56c8076b985ca280e0b0752",
      post: { content: "", cover_prompt: "", description: "", title: "" },
    });
    return Response.json({
      response: database,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function POST(req: Request) {
  const { data }: { data: string } = await req.json();
  try {
    return Response.json({ response: data });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
