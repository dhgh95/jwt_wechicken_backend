const puppeteer = require("puppeteer");
const moment = require("moment");
const months = require("./months");

module.exports = async function ({ url }) {
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

    await page.exposeFunction("refineDate", (originalDate) => {
      const [month, day, year] = originalDate.split(" ");
      const currentYear = new Date().getFullYear();
      return `${year || currentYear}.${months[month]}.${
        day.length === 1 ? `0${day}` : day
      }`;
    });

    const mediumcrawling = await page.evaluate(async (currentDate) => {
      const [_, featured, __, ...contents] = [
        ...document.querySelector(
          "#root > div > section > div:nth-child(3) > div:nth-child(1)"
        ).children,
      ];

      const posts = [];

      for (content of [featured, ...contents]) {
        let date = content.querySelector(
          "div > div > div > div > div > span > span > div > a"
        )?.innerText;
        date = await refineDate(date);

        if (date !== currentDate) break;

        const thumbnail = content.querySelector(
          "section > figure > div > div > div > div > img"
        )?.src;
        const title = content.querySelector("h1")?.innerText;
        const subtitle = content.querySelector("h2")?.innerText;
        const link = content.querySelector("div > div:nth-child(2) > a")?.href;
        const result = title && {
          title,
          subtitle,
          date,
          link,
          thumbnail,
        };
        result && posts.push(result);
      }
      return posts;
    }, moment().format("YYYY.MM.DD"));

    return mediumcrawling;
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
    console.log("end");
  }
};
