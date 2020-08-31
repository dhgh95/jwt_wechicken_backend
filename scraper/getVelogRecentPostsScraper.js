const puppeteer = require("puppeteer");
const moment = require("moment");

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
      if (originalDate.includes("년")) {
        const date = originalDate.match(/[0-9]+/g);
        return `${date[0]}.${date[1].length === 1 ? `0${date[1]}` : date[1]}.${
          date[2].length === 1 ? `0${date[2]}` : date[2]
        }`;
      }
      const currentDate = moment();
      if (originalDate.includes(`방금 전`)) {
        return currentDate.format("YYYY.MM.DD");
      }
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
    });

    const velogcrawling = await page.evaluate(async (currentDate) => {
      const posts = document.querySelectorAll(
        "#root > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div:nth-child(3) > div > div"
      );
      let todayPosts = [];
      for (let post of [...posts]) {
        let date = post.querySelector("div.subinfo > span").innerText;
        date = await refineDate(date);

        if (date !== currentDate) break;

        const link = `https://velog.io${
          post.querySelector("a").attributes.href.value
        }`;
        const thumnail = post.querySelector("a > div > img")?.attributes.src
          .value;
        const title = post.querySelector("a > h2").innerText;
        const subtitle = post.querySelector("p")?.innerText;

        todayPosts = [...todayPosts, { link, thumnail, title, subtitle, date }];
      }
      return todayPosts;
    }, moment().format("YYYY.MM.DD"));

    return velogcrawling;
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
    console.log("end");
  }
};
