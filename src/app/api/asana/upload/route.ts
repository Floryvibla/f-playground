import { uploadAttachmentAsana } from "@/lib/asana";
import { puppeteerLib } from "@/lib/puppeteer";
import { base64ToImage } from "@/lib/utils";
import { DesignTemplateRequest } from "@/types/design-template";
import { baseb64Img } from "./base64";

export async function POST(req: Request) {
  const data: any = await req.json();

  try {
    // const response = await uploadAttachmentAsana();
    console.log("response: ", data);

    return Response.json({ response: "okey" });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const response = base64ToImage(baseb64Img);
    console.log("response: ", response);

    return Response.json({ response });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
