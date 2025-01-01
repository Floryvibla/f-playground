import { sendMsgInstagram } from "@/lib/instagram";

export async function POST(req: Request) {
  const {
    msg,
    idSender,
  }: {
    msg: string;
    idSender: string;
  } = await req.json();
  try {
    const responseInstagram = await sendMsgInstagram({ idSender, msg });
    return Response.json({ response: responseInstagram });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
