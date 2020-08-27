const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const months = require("./months");
const mediumEvalute = require("./mediumEvaluate");

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

    posts = await page.evaluate(mediumEvalute);
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
