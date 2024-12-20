import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET(req: NextRequest, res: NextResponse) {
  let result = null;
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    await page.goto("https://example.com");

    result = await page.title();
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return Response.json({
    response: result,
  });
}
