import { base64ToImage } from "@/lib/utils";
import { error } from "console";

export async function POST(req: Request) {
  const data: any = await req.json();
  if (!("base64Img" in data)) {
    return Response.json({ error: "Precisa de base64Img" }, { status: 401 });
  }
  try {
    const response = base64ToImage(data.base64Img);
    if (response?.error) {
      return Response.json({ response }, { status: 401 });
    }
    return Response.json({ response });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
