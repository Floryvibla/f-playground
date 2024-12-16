import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const xHookSecret = request.headers.get("x-hook-secret");

  // Confirmação do Handshake
  if (xHookSecret) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Hook-Secret": xHookSecret,
      },
    });
  }

  try {
    const eventData = await request.json();
    await axios.post(
      "https://4f53-2804-1b3-a900-3ab7-491f-ad02-6d14-b88b.ngrok-free.app/webhook-test/asana-teste",
      { data: eventData },
      {
        // Ignorar erro de certificado autoassinado
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );
    console.log("webhook deu certo: ");
    console.log("Evento recebido:", eventData);

    // Adicione aqui o processamento do evento, como salvar no banco de dados
    return NextResponse.json(
      { message: "Evento processado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar evento:", error);
    return NextResponse.json(
      { message: "Erro ao processar evento." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Método não permitido." },
    { status: 405 }
  );
}
