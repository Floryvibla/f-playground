import { NextRequest, NextResponse } from "next/server";
import { createWebhook } from "@/utils/asana";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { resourceId, targetUrl } = body;

  if (!resourceId || !targetUrl) {
    return NextResponse.json(
      { message: "Resource ID e Target URL são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const webhook = await createWebhook(resourceId, targetUrl);
    return NextResponse.json(webhook, { status: 201 });
  } catch (error: any) {
    console.error(
      "Erro ao criar o webhook:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Erro ao criar webhook." },
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
