import express from "express";
import puppeteer from "puppeteer";
import nodeBlob from "node-blob";

const app = express();

const DOMAIN = process.env.DOMAIN || "localhost:3000";
const URL = process.env.URL || "http://localhost:3000";
const PATH = "/bygg/report";

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/createpdf", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-gpu"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  const page = await browser.newPage();

  //   page.setCookie({
  //     name: "state",
  //     value: JSON.stringify(data),
  //     domain: DOMAIN,
  //   });

  await page.goto("https://www.google.com", { waitUntil: "networkidle2" });
  await page.pdf({ path: "pdf/google.pdf", format: "A4" });

  await browser.close();

  res.download("pdf/google.pdf");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new nodeBlob(byteArray, { type: mimeType });
}
