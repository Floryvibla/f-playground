import axios from "axios";

const ASANA_API_BASE = "https://app.asana.com/api/1.0";
const ASANA_ACCESS_TOKEN = process.env.ASANA_PERSONAL_ACCESS_TOKEN;

if (!ASANA_ACCESS_TOKEN) {
  throw new Error(
    "O token de acesso da Asana não foi definido nas variáveis de ambiente."
  );
}

export const createWebhook = async (resourceId: string, targetUrl: string) => {
  try {
    const response = await axios.post(
      `${ASANA_API_BASE}/webhooks`,
      {
        data: {
          resource: resourceId,
          target: targetUrl,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao criar o webhook:",
      error.response?.data || error.message
    );
    throw error;
  }
};
