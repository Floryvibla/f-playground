import { Client } from "@notionhq/client";
import { splitTextIntoChunks } from "./utils";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function getDatabase(filter: { database_id: string }) {
  const tasks = await notion.databases.query(filter);
  return tasks;
}

const text = `Create a page
post
https://api.notion.com/v1/pages
Creates a new page that is a child of an existing page or database.

If the new page is a child of an existing page,title is the only valid property in the properties body param.

If the new page is a child of an existing database, the keys of the properties object body param must match the parent database's properties.

This endpoint can be used to create a new page with or without content using the children option. To add content to a page after creating it, use the Append block children endpoint.

Returns a new page object.

🚧
Some page properties are not supported via the API.

A request body that includes rollup, created_by, created_time, last_edited_by, or last_edited_time values in the properties object returns an error. These Notion-generated values cannot be created or updated via the API. If the parent contains any of these properties, then the new page’s corresponding values are automatically created.

📘
Requirements

Your integration must have Insert Content capabilities on the target parent page or database in order to call this endpoint. To update your integrations capabilities, navigation to the My integrations dashboard, select your integration, go to the Capabilities tab, and update your settings as needed.

Attempting a query without update content capabilities returns an HTTP response with a 403 status code.

Errors
Each Public API endpoint can return several possible error codes. See the Error codes section of the Status codes documentation for more information.

Body Params
parent
json
required
The parent page or database where the new page is inserted, represented as a JSON object with a page_id or database_id key, and the corresponding ID.

properties
json
required
The values of the page’s properties. If the parent is a database, then the schema must match the parent database’s properties. If the parent is a page, then the only valid object key is title.

children
array of strings
The content to be rendered on the new page, represented as an array of block objects.


ADD string
icon
json
The icon of the new page. Either an emoji object or an external file object..

cover
json
The cover image of the new page, represented as a file object.

Headers
Notion-Version
string
required
Defaults to 2022-06-28
Responses

200
200


400
400


404
404


429
429

`;

async function createPageDatabase(data: {
  database_id: string;
  post: {
    title: string;
    description: string;
    cover_prompt: string;
    content: string;
  };
}) {
  console.log("post: ", data.post);

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
