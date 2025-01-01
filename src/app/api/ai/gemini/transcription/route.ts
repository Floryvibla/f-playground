import { fileUploadGemini, getTranscriptionGemini } from "../config";

export async function POST(req: Request) {
  const { urlVideo }: { urlVideo: string } = await req.json();
  try {
    //   const response = await fileUploadGemini();
    const responseTranscription = await getTranscriptionGemini(urlVideo);
    return Response.json({ responseTranscription });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
