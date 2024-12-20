import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userUrl = searchParams.get("url");
    const imageUrl =
      userUrl === "default"
        ? userUrl
        : "https://homolog.plyn.com.br/africanize/wp-content/uploads/2024/12/cynthia-wicked.webp";

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Retorna a imagem com o tipo de conteúdo apropriado
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Falha ao processar a imagem" },
      { status: 500 }
    );
  }
}
