import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { generateUUID } from "@/lib/utils";

export async function POST(req: Request) {
  const { image }: { image: string } = await req.json();
  try {
    const idImg = generateUUID();
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      `${idImg}.png`
    );

    fs.writeFileSync(filePath, base64Data, "base64");

    const imageUrl = `/uploads/${idImg}.png`;

    return Response.json({ url: imageUrl });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Falha ao processar a imagem" },
      { status: 500 }
    );
  }
}
