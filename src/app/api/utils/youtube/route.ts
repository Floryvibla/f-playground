import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const response = await YoutubeTranscript.fetchTranscript(
      "https://www.youtube.com/watch?v=H4j1A_pY63U"
    );
    return Response.json({
      response: response,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}
