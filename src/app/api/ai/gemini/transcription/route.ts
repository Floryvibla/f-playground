import { fileUploadGemini, getTranscriptionGemini } from "../config";

export async function POST(req: Request) {
  const {
    urlMedia,
    contentType,
    prompt,
  }: { urlMedia: string; prompt?: string; contentType?: string } =
    await req.json();
  try {
    const responseTranscription = await getTranscriptionGemini(
      urlMedia,
      prompt,
      contentType
    );
    return Response.json({ responseTranscription });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
