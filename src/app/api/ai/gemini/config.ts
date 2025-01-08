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
import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { z } from "zod";
import { title } from "process";
import { createNewsletterPrompt } from "./prompts";

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

export async function getTranscriptionGemini(urlVideo: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content:
            "Gere o subtitle para esse video, escreva o subtitle em formato de SRT, retorna isso no idioma original do video",
          experimental_attachments: [
            {
              url: urlVideo,
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

export async function reelToPost(transcription: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      prompt: `
      ${promptVideoToPostV1}
      ---
      ${transcription}
      `,
      schema: z.object({
        title: z
          .string()
          .describe(
            "Crie um título curto e impactante para o post em portugues"
          ),
        description: z
          .string()
          .describe(
            "Descreva de forma objetiva e em português o propósito do post. O TEXTO TEM QUE SER EM PORTUGUES."
          ),
        cover_prompt: z
          .string()
          .describe(
            "Crie um prompt em inglês para gerar uma capa de post visualmente chamativa e curiosa, sem texto, e com representatividade negra, alinhada ao conteúdo do texto fornecido."
          ),
        content: z
          .string()
          .describe(
            "Escreva o conteúdo completo do post em português com pelo menos 400 palavras"
          ),
      }),
    });
    return object;
  } catch (error) {
    throw error;
  }
}

const promptVideoToPost = `
Você receberá a transcrição de um vídeo. Sua tarefa é criar um conteudo para o newsletter que eu tenho baseado no conteúdo do vídeo, como se fosse eu escrevendo.

IMPORTANTE: O post deve seguir estas diretrizes:  
1. Comece com um hook chamativo: Algo que capture atenção imediatamente e instigue curiosidade, Evite criar hooks no formato de perguntas. Os hooks devem ser abertos, deixando o leitor curioso para saber o que vem depois.
2. Explique a ideia principal do vídeo: Escreva como se o pensamento fosse seu, de forma clara, prática e com analogias, se necessário, para facilitar o entendimento.  
3. Escreva no estilo Flory-pro: Use um tom descontraído e profissional, conectando o conteúdo ao dia a dia do leitor. Use listas e parágrafos curtos para facilitar a leitura.  
4. Conclua com uma chamada à ação: Provoque reflexão ou engajamento com perguntas que vai criar um debate forte!
5. gere o conteudo em portugues.
6. MUITO IMPORTANTE: Evite emojis.

Entrada Exemplo:  
- Transcrição: "Neste vídeo, falamos sobre como IA pode ajudar profissionais autônomos a criar estratégias de marketing mais rapidamente, otimizando tempo e esforço."  

Saída Exemplo:  
"E se você pudesse criar estratégias de marketing em metade do tempo?
A inteligência artificial está mudando o jogo para profissionais autônomos. Ferramentas certas podem ajudar a criar campanhas alinhadas, economizar horas e ainda deixar você focar no que importa: crescer.  
Já imaginou o impacto disso no seu negócio?"  
`;

const promptVideoToPostV1 = `
Você receberá a transcrição de um vídeo. Sua tarefa é criar um post para o LinkedIn baseado no conteúdo do vídeo, como se fosse eu escrevendo.

O post deve seguir estas diretrizes:  
1. Comece com um hook chamativo: Algo que capture atenção imediatamente e instigue curiosidade.  
2. Explique a ideia principal do vídeo: Escreva como se o pensamento fosse seu, de forma clara, prática e com analogias, se necessário, para facilitar o entendimento.  
3. Escreva no estilo Flory-pro: Use um tom descontraído e profissional, conectando o conteúdo ao dia a dia do leitor. Use listas e parágrafos curtos para facilitar a leitura.  
4. Conclua com uma chamada à ação: Provoque reflexão ou engajamento com perguntas ou convites para o debate.
5. gere o conteudo em portugues.
6. Evite emojis.

Entrada Exemplo:  
- Transcrição: "Neste vídeo, falamos sobre como IA pode ajudar profissionais autônomos a criar estratégias de marketing mais rapidamente, otimizando tempo e esforço."  

Saída Exemplo:  
"E se você pudesse criar estratégias de marketing em metade do tempo?
A inteligência artificial está mudando o jogo para profissionais autônomos. Ferramentas certas podem ajudar a criar campanhas alinhadas, economizar horas e ainda deixar você focar no que importa: crescer.  
Já imaginou o impacto disso no seu negócio?"  
`;
