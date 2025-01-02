import * as fs from "fs";
import * as path from "path";

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const base64ToImage = (base64Data: string): any => {
  if (!base64Data) {
    return { error: "Base64 data is required" };
  }

  const base64String = base64Data.replace(
    /^data:image\/(jpeg|png);base64,/,
    ""
  );

  const idImg = generateUUID();
  const filename = `${idImg}.png`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  fs.writeFileSync(filePath, base64String, "base64");

  const imageUrl = `${process.env.NEXT_PUBLIC_FRONT}/uploads/${idImg}.png`;
  return { filePath, filename, imageUrl };
};

export function sortByDate(articles: any[], key: string): any[] {
  return articles.sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function urlImgToBase64(imageUrl: string) {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return base64;
}

export const sleep = (ms?: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms ?? 2000));

export function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1900
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize;
  }

  return chunks;
}
