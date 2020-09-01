const puppeteer = require("puppeteer");
const moment = require("moment");
const mediumEvalute = require("./mediumEvalute");
const velogEvalute = require("./velogEvalute");
const mediumChangeDateFormat = require("../utils/mediumChangeDateFormat");
const velogChangeDateFormat = require("../utils/velogChangeDateFormat");

module.exports = async function ({ url, blogType }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    devtools: false,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 926 });
    await page.goto(url);
    console.log("start");

    await page.exposeFunction(
      "changeDateFormat",
      blogType === "medium" ? mediumChangeDateFormat : velogChangeDateFormat
    );

    const recentCrawling = await page.evaluate(
      blogType === "medium" ? mediumEvalute : velogEvalute,
      moment().format("YYYY.MM.DD")
    );

    return recentCrawling;
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
    console.log("end");
  }
};
