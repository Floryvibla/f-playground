import { fileUploadGemini, getTranscriptionGemini } from "./config";

export async function GET(req: Request) {
  //   const { data }: { data: string } = await req.json();
  try {
    //   const response = await fileUploadGemini();
    const responseTranscription = await getTranscriptionGemini();
    return Response.json({ responseTranscription });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
