import { NextRequest, NextResponse } from "next/server";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Store the WhatsApp client instance
let client: Client | null = null;

// Initialize WhatsApp client
async function initWhatsAppClient() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ["--no-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    // Generate and display QR code in terminal
    qrcode.generate(qr, { small: true });
    console.log("QR Code generated. Scan it with your WhatsApp app to log in.");
  });

  client.on("ready", () => {
    console.log("WhatsApp client is ready!");
  });

  client.on("message", async (message) => {
    console.log(`Message received: ${message.body}`);
    // You can add auto-reply logic here if needed
  });

  await client.initialize();
  return client;
}

export async function GET(req: NextRequest) {
  try {
    // Inicializa o cliente WhatsApp se ainda não estiver inicializado
    await initWhatsAppClient();

    return NextResponse.json({
      status: "success",
      message: "WhatsApp client initialized. Check server console for QR code.",
      info: "Note: Due to Next.js serverless nature, this implementation may have limitations in production.",
    });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Endpoint to send a message
export async function POST(req: NextRequest) {
  try {
    if (!client) {
      await initWhatsAppClient();
    }

    const { phoneNumber, message } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        {
          status: "error",
          message: "Phone number and message are required",
        },
        { status: 400 }
      );
    }

    // Format the phone number (remove any non-numeric characters)
    const formattedNumber = phoneNumber.replace(/\D/g, "");

    // Send the message
    const chatId = `${formattedNumber}@c.us`;
    if (!client) {
      throw new Error("WhatsApp client is not initialized");
    }
    await client.sendMessage(chatId, message);

    return NextResponse.json({
      status: "success",
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to send message",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
