import { puppeteerLib } from "@/lib/puppeteer";
import { generateUUID } from "@/lib/utils";
import { DesignTemplateRequest } from "@/types/design-template";
import fs from "fs";
import path from "path";
import { uploadAttachmentAsana } from "@/lib/asana"; // Importe a função de upload

interface IUploadAttachment extends DesignTemplateRequest {
  taskId: string;
}

export async function POST(req: Request) {
  const data: IUploadAttachment = await req.json();
  if (!data?.url) {
    return Response.json(
      { error: "url da imagem está faltando" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams(
    Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  try {
    const browser = await puppeteerLib();
    const page = await browser.newPage();

    const frontendUrl = `${process.env
      .NEXT_PUBLIC_FRONT!}/template/afri?${params.toString()}`;

    await page.goto(frontendUrl, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const selector = "#design-content";
    await page.waitForSelector(selector);

    const element = await page.$(selector);

    if (!element) {
      throw new Error("Elemento não encontrado na página");
    }

    const boundingBox = await element.boundingBox();
    const sizeImage = { width: 1080, height: 1350 };

    if (!boundingBox) {
      throw new Error("Não foi possível obter o boundingBox do elemento.");
    }

    // Ajusta a área a ser capturada
    const screenshot = await page.screenshot({
      type: "png",
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        ...sizeImage,
      },
    });

    await browser.close();

    const idImg = generateUUID();
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      `${idImg}.png`
    );

    // Salva a imagem gerada
    fs.writeFileSync(filePath, screenshot, "binary");

    // const imageUrl = `/uploads/${idImg}.png`;

    // Agora chama a função de upload passando os parâmetros
    const parentId = data.taskId; // Exemplo de ID do "parent"
    const filename = `${idImg}.png`; // Nome do arquivo gerado
    const uploadResponse = await uploadAttachmentAsana({
      parentId,
      filePath,
      filename,
    });

    return Response.json({ response: uploadResponse });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
