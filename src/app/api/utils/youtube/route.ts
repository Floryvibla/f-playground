import { YoutubeTranscript } from "youtube-transcript";
export async function GET() {
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
