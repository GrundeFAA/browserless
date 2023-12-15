import express from "express";
import puppeteer from "puppeteer";
import nodeBlob from "node-blob";

const app = express();

const DOMAIN = process.env.DOMAIN || "localhost:3000";
const URL = process.env.URL || "http://localhost:3000";
const PATH = "/bygg/report";

const data = {
  solutionStore: {
    solutions: [
      {
        id: "d6744c7a-e36c-448f-a59b-a8f5d62b9049",
        product: "pallereol",
        height: 4500,
        depth: 1100,
        load: 6000,
        amount: 1,
        setup: [
          {
            id: "70882368-a2d8-41fe-849c-607da51520ed",
            type: "bærejern",
            length: 2700,
            load: 1800,
            levels: 5,
            amount: 2,
          },
          {
            id: "96cc0007-78b7-4653-9516-0f0de0043f1e",
            type: "bærejern",
            length: 1800,
            load: 2500,
            levels: 8,
            amount: 1,
          },
        ],
      },
    ],
    activeId: "d6744c7a-e36c-448f-a59b-a8f5d62b9049",
  },
  itemsAndPricesStore: { accessoryItems: [] },
};

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

  page.setCookie({
    name: "state",
    value: JSON.stringify(data),
    domain: DOMAIN,
  });

  await page.goto(URL + PATH, {
    waitUntil: "networkidle2",
    timeout: 45000,
  });
  await page.waitForSelector("#report");

  await page.pdf({
    path: "pdf/solution.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  res.download("pdf/solution.pdf");
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
