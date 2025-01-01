import { getTranscriptionGemini, reelToPost } from "@/app/api/ai/gemini/config";
import { sendMsgInstagram } from "@/lib/instagram";
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
  // try {
  //   await axios.post(
  //     "https://localhost:5678/webhook/instagram-webhook",
  //     {
  //       data: responseReq,
  //     },
  //     {
  //       httpsAgent: new (require("https").Agent)({
  //         rejectUnauthorized: false,
  //       }),
  //     }
  //   );
  // } catch (error: any) {
  //   console.log("Error n8n webhoo: ", error.response);
  // }
  try {
    console.log("Entramos...");

    const data = responseReq.entry.filter(
      (i: any) => i.id !== i.messaging[0].sender.id
    );
    const messaging = data[0]?.messaging[0];
    const message = messaging?.message;

    // console.log("Json: " + JSON.stringify(responseReq, null, 2));
    await sendMsgInstagram({
      idSender: messaging.sender.id,
      msg: "Iniciando os trabalho...",
    });

    if (!messaging) {
      return Response.json({ response: "ok!" });
    }

    if (message && "attachments" in message) {
      console.log("Is attachments...");
      const attachment = message.attachments[0];
      if (attachment.type === "ig_reel") {
        console.log("Is Video reel...");
        const videoUrl = attachment.payload.url;
        console.log("Pegando transcription...");
        const transcription = await getTranscriptionGemini(videoUrl);
        console.log("Esperando criar post baseado no video...");
        const resultReelToPost = await reelToPost(
          JSON.stringify(transcription)
        );
        console.log("Respondendo a msg...: ", resultReelToPost);
        await sendMsgInstagram({
          idSender: messaging.sender.id,
          msg: resultReelToPost.content,
        });
        return Response.json({ response: resultReelToPost, videoUrl });
      }
    }

    return Response.json({ response: responseReq });
  } catch (error: any) {
    console.log("Error: ", error.response);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
