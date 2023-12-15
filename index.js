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
        id: "a35b9451-cc4e-4d41-880a-16c2cc2c9151",
        product: "smavarereol",
        height: 2500,
        depth: 500,
        amount: 1,
        setup: [
          {
            id: "db483c23-8c11-47fb-ab25-ef4f16dc970b",
            type: "hylle",
            length: 1000,
            load: 200,
            levels: 5,
            amount: 2,
          },
          {
            id: "6753f14d-dbea-4ffd-a299-c2d2160c14e2",
            type: "hylle",
            length: 1300,
            load: 200,
            levels: 3,
            amount: 1,
          },
        ],
      },
    ],
  },
};

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/createpdf", async (req, res) => {
  console.time("pdf");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=swiftshader"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  const page = await browser.newPage();

  await page.setCookie({
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
  console.timeEnd("pdf");
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
