import { dailyDevByTagFeed } from "@/lib/daily-dev";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  if (!tag) {
    return Response.json({ error: "Precisa de tag" }, { status: 401 });
  }
  try {
    const response = await dailyDevByTagFeed({ tag });
    const data = response.data.page.edges.map((i: any) => i.node);
    return Response.json({
      response: data || null,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}
