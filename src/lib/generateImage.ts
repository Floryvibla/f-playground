import axios from "axios";
import { base64ToImage } from "./utils";
import { uploadFilesGoogleDrive } from "./google-drive";

export async function generateImageFx({
  seed = 320353,
  candidatesCount = 1,
  prompt,
}: {
  seed?: number;
  candidatesCount?: number;
  prompt: string;
}): Promise<any> {
  const url = "https://aisandbox-pa.googleapis.com/v1:runImageFx";

  const headers = {
    accept: "*/*",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    authorization:
      "Bearer ya29.a0AXeO80Seo0pjI2RgYDyU30ax6HBoh0FvUccSY5-kBmgbZiWCRLR4fA_gHhF7b8atTQtdIED4q4NVynKvVqn2BRaSXyt2die7awkxzNxyd62t2Td3SpOj3NOVCcIVG2f4yq3GkyFY7BrJT5YKqS37y77Lxf4KMK6k9C1yoIwictThsBtzsp2-rxp3SNdegRkuV8pMmZs6SysZU48VgIdPulNSnr8lZvY74gVpOT0xoOTfQEvAIIky0prvXWy_J9A5tBqcL-i8PYb80YIi0c4glGnPf1ZE_5jF_ppLg-dVTOP32w9WoGeb8uGnlA7bgosV9FHZFGKnl3s4B8bjabtaSCzhZRLcAYci31K1t2GHMsO_sxwV6bYSITr5g89OdyPM2ZK5v0bqjjtlMbSYSVdnd_y9V3Tvuw9WuyENWebNMQaCgYKAfsSARMSFQHGX2MiVxuk5gTdJU-twqWTii_Z5g0433",
    "content-type": "text/plain;charset=UTF-8",
    origin: "https://labs.google",
    priority: "u=1, i",
    referer: "https://labs.google/",
    "sec-ch-ua": '"Chromium";v="130", "Opera";v="115", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0",
    "x-client-data": "CL2KywE=",
  };

  const data = {
    userInput: {
      candidatesCount,
      prompts: [prompt],
      seed,
    },
    clientContext: {
      sessionId: ";1735831694793",
      tool: "IMAGE_FX",
    },
    modelInput: {
      modelNameType: "IMAGEN_3_1",
    },
    aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function generateImageUploadGoogleDrive(prompt: string) {
  const responseGenerateImage = await generateImageFx({
    prompt,
    candidatesCount: 2,
  });
  const responseBase64 =
    responseGenerateImage.imagePanels[0].generatedImages.map((item: any) =>
      base64ToImage(item.encodedImage)
    );
  console.log("responseBase64.images: ");

  const responseGoogleDrive = await uploadFilesGoogleDrive(responseBase64);
  return responseGoogleDrive;
}
