import { Client } from "@notionhq/client";
import { splitTextIntoChunks } from "./utils";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function getDatabase(filter: { database_id: string }) {
  const tasks = await notion.databases.query(filter);
  return tasks;
}

async function createPageDatabase(data: {
  database_id: string;
  post: {
    title: string;
    description: string;
    cover_prompt: string;
    content: string;
  };
  source: string;
}) {
  console.log("post: ");

  const children: any = splitTextIntoChunks(data.post.content).map((chunk) => ({
    object: "block",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: chunk,
          },
        },
      ],
    },
  }));

  const tasks = await notion.pages.create({
    parent: {
      database_id: data.database_id,
    },
    properties: {
      content: [
        {
          text: {
            content: data.post.title,
          },
        },
      ],
      description: [
        {
          text: {
            content: data.post.description,
          },
        },
      ],
      source: [
        {
          text: {
            content: data.source,
          },
        },
      ],
      cover_prompt: [
        {
          text: {
            content: data.post.cover_prompt,
          },
        },
      ],
    },
    children,
  });
  return tasks;
}

export const notionLib = {
  getDatabase,
  createPageDatabase,
};
