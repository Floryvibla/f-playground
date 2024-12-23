import { uploadAttachmentAsana } from "@/lib/asana";
import fs from "fs";

export async function POST(req: Request) {
  const data: { taskId: string; filePath: string; filename: string } =
    await req.json();
  if (!("taskId" in data)) {
    return Response.json({ error: "Precisa de taskId" }, { status: 401 });
  }
  if (!("filePath" in data)) {
    return Response.json({ error: "Precisa de filePath" }, { status: 401 });
  }
  if (!("filename" in data)) {
    return Response.json({ error: "Precisa de filename" }, { status: 401 });
  }

  try {
    const response = await uploadAttachmentAsana(
      data.taskId,
      data.filePath,
      data.filename
    );
    fs.unlinkSync(data.filePath);
    return Response.json({ response });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
