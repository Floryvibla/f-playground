import { generateImageFx } from "@/lib/generateImage";
import { uploadFilesGoogleDrive } from "@/lib/google-drive";
import { base64ToImage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Aqui...");

    const responseGenerateImage = await generateImageFx({
      prompt:
        "An illustration of a confident Black professional surrounded by symbolic representations of foundational knowledge—like glowing books, gears, and creative tools—set against a dynamic and inspiring background, emphasizing growth, curiosity, and mastery over trends. 16:9 ratio, visually engaging and modern",
      candidatesCount: 2,
    });
    const responseBase64 =
      responseGenerateImage.imagePanels[0].generatedImages.map((item: any) =>
        base64ToImage(item.encodedImage)
      );
    console.log("responseBase64.images: ");

    const responseGoogleDrive = await uploadFilesGoogleDrive(responseBase64);
    return Response.json({
      response: responseGoogleDrive,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
}
