import { base64ToImage, urlImgToBase64 } from "@/lib/utils";

export async function POST(req: Request) {
  const data: { base64Img: string; imageUrl: string } = await req.json();

  let dataBase64;

  if ("imageUrl" in data) {
    const base64 = await urlImgToBase64(data.imageUrl);

    dataBase64 = base64.toString();
  }
  if ("base64Img" in data) {
    dataBase64 = data.base64Img;
  }

  try {
    const response = base64ToImage(dataBase64!);
    if (response?.error) {
      return Response.json({ response }, { status: 401 });
    }
    return Response.json({ response });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
