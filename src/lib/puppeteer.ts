import puppeteerCore, { Browser as BrowserCore } from "puppeteer-core";
import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function puppeteerProd(): Promise<BrowserCore> {
  const browser = await puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  return browser;
}

export async function puppeteerDev(): Promise<Browser> {
  const browser = await puppeteer.launch({ headless: true });

  return browser;
}

export async function puppeteerLib(): Promise<BrowserCore | Browser> {
  if (process.env.NODE_ENV === "production") {
    return await puppeteerProd();
  } else {
    return await puppeteerDev();
  }
}
