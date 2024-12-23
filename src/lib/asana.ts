import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";

// Configuração do cliente do Asana API
export const asanaApi = axios.create({
  baseURL: "https://app.asana.com/api/1.0",
  headers: {
    Authorization:
      "Bearer 2/1188252661281088/1208982567072800:f65d9fe56db7d8841e56b03b1a1a20f3", // Substitua com o seu token
  },
});

// Função para upload de anexo no Asana
export async function uploadAttachmentAsana(
  parentId: string,
  filePath: string,
  filename: string
) {
  try {
    // Crie o FormData
    const formData = new FormData();
    formData.append("parent", parentId); // Passando o parent dinamicamente
    formData.append("file", fs.createReadStream(filePath), {
      filename,
      contentType: "image/png", // Ajuste o tipo de conteúdo conforme necessário
      header: {
        "Content-Disposition": `form-data; name="file"; filename=${filename}; filename*=UTF-8''${filename}`,
      },
    });

    // Faça a requisição
    const response = await asanaApi.post("/attachments", formData, {
      headers: {
        ...formData.getHeaders(), // Headers do FormData
      },
    });

    return response.data; // Retorna os dados da resposta (ou manipula conforme necessário)
  } catch (error: any) {
    console.error(
      "Erro ao enviar o arquivo:",
      error.response?.data || error.message
    );
  }
}
