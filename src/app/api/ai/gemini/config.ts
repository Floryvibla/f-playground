import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  GoogleAIFileManager,
  FileState,
  FileMetadataResponse,
} from "@google/generative-ai/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { z } from "zod";

export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY!
); // Initialize Google Generative AI with the API key

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const modelGemini = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  safetySettings: safetySettings,
});

export const fileManagerGemini = new GoogleAIFileManager(
  process.env.API_KEY_GEMINI!
);

export const googleModel = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function fileUploadGemini(path?: string) {
  try {
    const uploadResponse = await fileManagerGemini.uploadFile(
      "/Users/flory/Downloads/video-teste.mp4",
      {
        //give the path as an argument
        mimeType: "video/mp4",
        displayName: "video-teste.mp4",
      }
    );
    const name = uploadResponse.file.name;
    let file = await fileManagerGemini.getFile(name);
    while (file.state === FileState.PROCESSING) {
      //check the state of the file
      process.stdout.write(".");
      await new Promise((res) => setTimeout(res, 10000)); //check every 10 second
      file = await fileManagerGemini.getFile(name);
    }
    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed");
    }
    return file;
  } catch (error) {
    throw error;
  }
}

export async function getTranscriptionGemini(file?: FileMetadataResponse) {
  try {
    // const result = await modelGemini.generateContent([
    //   {
    //     fileData: {
    //       mimeType: "video/mp4",
    //       fileUri:
    //         "https://generativelanguage.googleapis.com/v1beta/files/q9w482wl7u5d",
    //     },
    //   },
    //   {
    //     text: `Gere o subtitle para esse video, escreva o subtitle em formato de SRT, retorna isso no idioma original do video`,
    //   },
    // ]);
    console.log("Agora GenerateObject");

    const { object } = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content:
            "Gere o subtitle para esse video, escreva o subtitle em formato de SRT, retorna isso no idioma original do video",
          experimental_attachments: [
            {
              url: "https://d.rapidcdn.app/snapinsta?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXdhdzItMi5jZG5pbnN0YWdyYW0uY29tL28xL3YvdDE2L2YyL204Ni9BUU9wZHNTcWRZQXNmMnN2MDBqeDZJNDVCcDMtck11Yi1GS0RvcVFYVUVvcjBNNVc5RDAwbUk2cWNHSmxORGR1SnRiNDBqVXMxVFB0MUpJTU9zQ3NtUWZJNnY4emlLd180TnRlZDhNLm1wND9zdHA9ZHN0LW1wNCZlZmc9ZXlKeFpWOW5jbTkxY0hNaU9pSmJYQ0pwWjE5M1pXSmZaR1ZzYVhabGNubGZkblJ6WDI5MFpsd2lYU0lzSW5abGJtTnZaR1ZmZEdGbklqb2lkblJ6WDNadlpGOTFjbXhuWlc0dVkyeHBjSE11WXpJdU56SXdMbUpoYzJWc2FXNWxJbjAmX25jX2NhdD0xMDAmdnM9MTY4MDQ1Mzk0OTQxMzU2MV82NzIxNzAxOTcmX25jX3ZzPUhCa3NGUUlZVW1sblgzaHdkbDl5WldWc2MxOXdaWEp0WVc1bGJuUmZjM0pmY0hKdlpDODNNRFJETmtaQk16YzFSRVV6UWtRNE5FSTFPVGM0TVRnMk1ETXlNREZCUWw5MmFXUmxiMTlrWVhOb2FXNXBkQzV0Y0RRVkFBTElBUUFWQWhnNmNHRnpjM1JvY205MVoyaGZaWFpsY25OMGIzSmxMMGRCYVRGUmFIUmZTM05WVjNnd2MwUkJSbVEzVG1sUmVubFZTakppY1Y5RlFVRkJSaFVDQXNnQkFDZ0FHQUFiQUJVQUFDYUNxdnFRJTJGNmFNUUJVQ0tBSkRNeXdYUUZBeEJpVGRMeHNZRW1SaGMyaGZZbUZ6Wld4cGJtVmZNVjkyTVJFQWRmNEhBQSUzRCUzRCZjY2I9OS00Jm9oPTAwX0FZRGdnVXNDeEgzWXpLRzhIUnJQXzBJOHUxbkRwaWVJVVoxRmlXMjA4TC13N1Emb2U9Njc3NjUzRTkmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBpbnN0YS5hcHBfdmlkZW9fQVFPcGRzU3FkWUFzZjJzdjAwang2STQ1QnAzLXJNdWItRktEb3FRWFVFb3IwTTVXOUQwMG1JNnFjR0psTkRkdUp0YjQwalVzMVRQdDFKSU1Pc0NzbVFmSTZ2OHppS3dfNE50ZWQ4TS5tcDQifQ.-sBNb8kczNzaGKqOAjaIXF_4BgS67Qy9jwe2no2j0QM&dl=1&dl=1",
              contentType: "video/mp4",
            },
          ],
        },
      ],
      schema: z.object({
        subtitles: z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
            text: z.string(),
          })
        ),
      }),
    });
    return object;
  } catch (error) {
    throw error;
  }
}
