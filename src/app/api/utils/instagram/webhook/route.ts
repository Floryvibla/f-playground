import { getTranscriptionGemini, reelToPost } from "@/app/api/ai/gemini/config";
import { sendMsgInstagram } from "@/lib/instagram";
import { notionLib } from "@/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hubChallenge = searchParams.get("hub.challenge");
  try {
    return new Response(hubChallenge);
  } catch (error) {
    console.log("Error: ", error);
  }
  // await axios.post(
  //   "https://localhost:5678/webhook-test/reelToPost",
  //   {
  //     content: "Aqui",
  //   },
  //   {
  //     httpsAgent: new (require("https").Agent)({
  //       rejectUnauthorized: false,
  //     }),
  //   }
  // );
  // return Response.json({ response: "ok!" });
}

export async function POST(req: Request) {
  const responseReq = await req.json();
  let messaging;
  try {
    const data = responseReq.entry.filter(
      (i: any) => i.id !== i.messaging[0].sender.id
    );
    messaging = data[0]?.messaging[0];
    const message = messaging?.message;

    if (!messaging) {
      return Response.json({ response: "ok!" });
    }

    if (message && "attachments" in message) {
      await sendMsgInstagram({
        idSender: messaging.sender.id,
        msg: "Iniciando os trabalho...",
      });
      // console.log("Is attachments...: ", );
      const attachment = message.attachments[0];
      if (attachment.type === "ig_reel") {
        const videoUrl = attachment.payload.url;
        const transcription = await getTranscriptionGemini(videoUrl);
        const responseNotion: any = await notionLib.createPageDatabase({
          database_id: "16de28dda56c8076b985ca280e0b0752",
          post: transcription,
          source: videoUrl,
        });
        await sendMsgInstagram({
          idSender: messaging.sender.id,
          msg: responseNotion.url,
        });

        return Response.json({ response: transcription, videoUrl });
      }
    }

    return Response.json({ response: responseReq });
  } catch (error: any) {
    console.log("Error: ", JSON.stringify(error, null, 2));
    await sendMsgInstagram({
      idSender: messaging.sender.id,
      msg: `Algo deu errado`,
    });
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
