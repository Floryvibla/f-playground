import { PERPLEXITY } from "@/app/constants/perplexity";
import axios, { AxiosResponse } from "axios";

export async function fetchperplexityStream(content: string): Promise<any> {
  const url = "https://www.morphic.sh/api/chat-stream";
  const headers = {
    accept: "*/*",
    "accept-language":
      "pt-BR,pt;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
    "content-type": "application/json",
    cookie: PERPLEXITY.COOKIES,
    origin: "https://www.morphic.sh",
    priority: "u=1, i",
    referer: "https://www.morphic.sh/",
    "sec-ch-ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };
  const body = {
    messages: [
      {
        role: "user",
        content,
        type: "input",
        // id: "8goNhZ1esNRp7IWC",
        status: "done",
      },
    ],
  };

  let accumulatedData = "";

  try {
    const response: AxiosResponse<any> = await axios.post(url, body, {
      headers,
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk: Buffer) => {
        accumulatedData += chunk.toString();
      });

      response.data.on("end", () => {
        console.log("Stream finalizado.");
        const dataLines = accumulatedData.split("\n");
        try {
          const parsedData = dataLines
            .filter((line) => line.trim() !== "")
            .map((line) => JSON.parse(line));

          const result = parsedData
            .filter(
              (item) =>
                item.type === "answer" &&
                item.role === "assistant" &&
                item.content
            ) // Filtra as condições
            .map((item) => item.content) // Extrai o conteúdo
            .join("");
          resolve(result);
        } catch (error: any) {
          console.error("Erro ao parsear os dados:", error.message);
          reject(error);
        }
      });

      response.data.on("error", (err: Error) => {
        console.error("Erro no stream:", err);
        reject(err); // Se houver erro no stream, rejeita a Promise
      });
    });
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error; // Caso o erro ocorra na requisição
  }
}
