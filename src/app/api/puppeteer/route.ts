import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { puppeteerLib } from "@/lib/puppeteer";

export async function GET() {
  let result = null;
  let browser = null;
  try {
    browser = await puppeteerLib();

    let page = await browser.newPage();

    await page.goto(
      "https://www.deepdev.org/blog/react-project-ideas-practical-features-guide?ref=dailydev"
    );

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
