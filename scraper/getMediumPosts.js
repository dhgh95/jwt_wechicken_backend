const puppeteer = require("puppeteer");
const faker = require("faker");
const fs = require("fs").promises;
const months = require("./months");

const getMediumPosts = async (mediumLink) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1080,
      height: 840,
    },
  });

  let posts;
  try {
    const page = await browser.newPage();

    await page.goto(mediumLink, {
      waitUntil: "load",
    });

    posts = await page.evaluate(() => {
      const [_, __, ___, ...contents] = [
        ...document.querySelector(
          "#root > div > section > div:nth-child(3) > div:nth-child(1)",
        ).children,
      ];

      return contents.map((content) => {
        const thumbnail = content.querySelector(
          "section > figure > div > div > div > div > img",
        )?.src;

        const title = content.querySelector("h1")?.innerText;
        const subtitle = content.querySelector("h2")?.innerText;
        const date = content.querySelector(
          "div > div > div > div > div > span > span > div > a",
        )?.innerText;
        const link = content.querySelector("div > div:nth-child(2) > a").href;

        return {
          title,
          subtitle,
          date,
          link,
          thumbnail,
        };
      });
    });
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
    return posts;
  }
};

const main = async () => {
  let mediumPosts = await getMediumPosts("https://medium.com/@jun.choi.4928");

  const changeDateFormat = (originalDate) => {
    const [month, day, year] = originalDate.split(" ");
    const currentYear = new Date().getFullYear();
    return `${year ? year : currentYear}.${months[month]}.${day}`;
  };

  mediumPosts = mediumPosts.map((post) => {
    return {
      ...post,
      date: changeDateFormat(post.date),
      type: "medium",
    };
  });

  fs.writeFile("./json/medium.json", JSON.stringify(mediumPosts, null, 2))
    .then((resolved) => console.log("succeed"))
    .catch((err) => console.log(err));
};

main();
