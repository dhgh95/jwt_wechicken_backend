const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
const velogEvalute = require("./velogEvaluate");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  await page.goto("https://velog.io/@yoju", {
    waitUntil: "load",
  });

  let velogcrawling = await page.evaluate(velogEvalute);

  const refineDate = (originalDate) => {
    if (originalDate.includes("년")) {
      const date = originalDate.match(/[0-9]+/g);
      return `${date[0]}.${date[1].length === 1 ? `0${date[1]}` : date[1]}.${
        date[2].length === 1 ? `0${date[2]}` : date[2]
      }`;
    }
    const currentDate = moment();
    if (originalDate.includes(`일 전`)) {
      const beforeDay = originalDate.match(/[0-9]/gi)[0];
      return currentDate.subtract(beforeDay, "d").format("YYYY.MM.DD");
    }
    if (originalDate.includes("시간")) {
      const beforeTime = originalDate.match(/[0-9]+/gi)[0];
      return currentDate.subtract(beforeTime, "H").format("YYYY.MM.DD");
    }
    if (originalDate.includes("분")) {
      const beforeMinute = originalDate.match(/[0-9]+/gi)[0];
      return currentDate.subtract(beforeMinute, "m").format("YYYY.MM.DD");
    }
  };

  velogcrawling = velogcrawling.map((post) => {
    return { ...post, date: refineDate(post.date), type: "velog" };
  });

  fs.writeFile("./json/velog.json", JSON.stringify(velogcrawling, null, 2))
    .then((resolved) => console.log("succeed"))
    .catch((rejected) => console.log(rejected));

  await browser.close();
})();
