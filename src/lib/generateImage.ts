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
      "Bearer ya29.a0ARW5m76jVz5Jm-oVfEBnx5EMiD9omfykqtc-krbnEJ6XaB85ng-W2mvPQGfC_LhK3c4on5APArvmwTqAHLTuRYJGGw6o4OiX9XUxjRf9TPwTa685c6vxUP6FNff0VxE9FMdWhE9-7pRZZxJmRXOwfFcqQ7fBmZLQ5zFlNS9EcfIFPOt0myFwD83zuwYRnc07VGjCCQ7HS-121ma4Oh3nVSbV24lD1oFiyEa7HWjc0HVNZmFKgr-1gzSYzhGvo7_B4QRk6ee__HPoq_xE1MtI-zy7wFZMYm6HYJRLXNFWaLV8eAHd8qZBt0ZNEUFUW6EFaZl1SjWy1NLH9k-nzrlujkyS8YBVGpYGZMbNlwu6QyYGateKTVLRq7QWH5gPWyHuFY9vJkaPo5lIgbBlj_C4UavEB7dcvW47ksJhpgpJaCgYKAfESARMSFQHGX2MiXer3o0wN9AjhtNpYtaNcZA0431",
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
