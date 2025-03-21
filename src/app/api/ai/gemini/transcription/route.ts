import { fileUploadGemini, getTranscriptionGemini } from "../config";

export async function POST(req: Request) {
  const {
    urlMedia,
    contentType,
    prompt,
    apiKey,
  }: {
    urlMedia: string;
    prompt?: string;
    contentType?: string;
    apiKey?: string;
  } = await req.json();
  try {
    const responseTranscription = await getTranscriptionGemini(
      urlMedia,
      prompt,
      contentType,
      apiKey
    );
    return Response.json({ responseTranscription });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
