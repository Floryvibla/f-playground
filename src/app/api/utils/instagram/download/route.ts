import { downloadVideoInstagram } from "@/lib/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { urlVideo }: { urlVideo: string } = await req.json();
  try {
    const response = await downloadVideoInstagram(urlVideo);
    return Response.json({
      url: response,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}
