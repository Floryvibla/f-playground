import axios from "axios";
import FormData from "form-data";
import { puppeteerLib } from "./puppeteer";
import { sleep } from "./utils";

export async function sendMsgInstagram({
  idSender,
  msg,
}: {
  msg: string;
  idSender: string;
}) {
  try {
    console.log("Send msg!");

    const response = await axios.post(
      "https://graph.instagram.com/v21.0/me/messages",
      {
        message: JSON.stringify({ text: msg }),
        recipient: JSON.stringify({ id: idSender }),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_INSTAGRAM}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error sending Instagram message:", error.response);
    throw error.response;
  }
}

export async function downloadVideoInstagram(reelsUrl: string) {
  try {
    const browser = await puppeteerLib();
    const page = await browser.newPage();

    await page.goto("https://saveinta.com/en", {
      waitUntil: "networkidle0",
    });
    await page.emulateMediaType("screen");
    await page.waitForSelector('[name="q"]');
    await page.type('[name="q"]', reelsUrl);

    await page.waitForSelector('[type="button"]');
    await page.click('[type="button"]');
    const btnCloseModal = "#closeModalBtn";
    await page.waitForSelector(btnCloseModal);
    await sleep(3000);
    await page.click(btnCloseModal);

    const videoSelector =
      "#search-result > ul > li > div > div.download-items__btn > a";
    await page.waitForSelector(videoSelector);

    //   @ts-ignore
    const videoUrl = await page.$eval(videoSelector, (el: any) => el.href);

    await browser.close();

    return videoUrl;
  } catch (error: any) {
    console.error(
      "Erro ao enviar solicitação:",
      error.response?.data || error.message
    );
  }
}
