import { google } from "googleapis";
import fs from "fs";

export const GOOGLE_DRIVE_FOLDER_UPLOAD_ID =
  process.env.GOOGLE_DRIVE_FOLDER_UPLOAD_ID ||
  "1_B483G2ZDJMcF6tlMYpe6fsSVtg9f8kD";

export const authGoogleDrive = new google.auth.GoogleAuth({
  keyFile: "./googledrive.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export const driveService = google.drive({
  version: "v3",
  auth: authGoogleDrive,
});

export async function uploadFilesGoogleDrive(
  files: {
    filePath: string;
    filename: string;
    mimeType: string;
  }[]
) {
  const uploadPromises = files.map(async ({ filePath, filename, mimeType }) => {
    try {
      const fileMetadata = {
        name: filename,
        parents: [GOOGLE_DRIVE_FOLDER_UPLOAD_ID],
      };

      const media = {
        mimeType,
        body: fs.createReadStream(filePath),
      };

      const response = await driveService.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id",
      });

      console.log(`Arquivo ${filename} enviado com sucesso:`);
      fs.unlinkSync(filePath);
      return {
        ...response.data,
        url: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
      };
    } catch (error) {
      console.error(`Erro ao enviar arquivo ${filename}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}
