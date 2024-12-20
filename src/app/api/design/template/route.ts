import { puppeteerLib } from "@/lib/puppeteer";
import { DesignTemplateRequest } from "@/types/design-template";

export async function POST(req: Request) {
  const data: DesignTemplateRequest = await req.json();
  if (!data?.url) {
    return Response.json(
      { error: "url da image está faltando" },
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

    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/png",
      },
    });
    // return Response.json({ teste: "Tudo okey" });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
