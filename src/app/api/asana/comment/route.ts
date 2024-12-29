import { uploadAttachmentAsana } from "@/lib/asana";
import { base64ToImage, urlImgToBase64 } from "@/lib/utils";
import fs from "fs";

export async function POST(req: Request) {
  const data: {
    taskId: string;
    filePath: string;
    filename: string;
    imgUrl?: string;
  } = await req.json();
  let base64Data = null;
  let haveBase64Data = false;
  if (!("taskId" in data)) {
    return Response.json({ error: "Precisa de taskId" }, { status: 401 });
  }
  if (!data.imgUrl) {
    if (!("filePath" in data)) {
      return Response.json({ error: "Precisa de filePath" }, { status: 401 });
    }
    if (!("filename" in data)) {
      return Response.json({ error: "Precisa de filename" }, { status: 401 });
    }
  } else {
    const base64Img = await urlImgToBase64(data.imgUrl);
    base64Data = base64ToImage(base64Img);
    haveBase64Data = true;
  }

  // data.taskId, data.filePath, data.filename;

  try {
    const response = await uploadAttachmentAsana({
      filename: haveBase64Data ? base64Data.filename : data.filename,
      filePath: haveBase64Data ? base64Data.filePath : data.filePath,
      parentId: data.taskId,
    });
    fs.unlinkSync(haveBase64Data ? base64Data.filePath : data.filePath);
    return Response.json({ response });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
