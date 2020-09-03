const puppeteer = require("puppeteer");
const mediumChangeDateFormat = require("../utils/mediumChangeDateFormat");
const velogChagneDateFormat = require("../utils/velogChangeDateFormat");

class InfiniteScrollBrowser {
  constructor() {
    this.browser = null;
    this.page = null;
    this.canScroll = true;
    this.isEndReached = false;
    this.isScraped = false;
  }

  async start(opts) {
    const lauchOpts = opts
      ? opts
      : { headless: true, args: ["--no-sandbox"], devtools: false };
    this.browser = await puppeteer.launch(lauchOpts);
  }

  async checkIsEnd(blogType) {
    let isEnd = false;
    if (blogType === "medium") {
      const h4Values = await this.page.$$eval("div > div > h4", (h4Tags) =>
        h4Tags.map((h4Tag) => h4Tag.innerText)
      );

      isEnd = !!h4Values.find((value) => value.includes("Claps from"));
    }

    if (blogType === "velog") {
      const postsCount = await this.page.$eval(
        "#root > div > div > div:nth-child(4)  > div > div > div > div > ul > li > span",
        (postsCountTag) => postsCountTag.innerText
      );

      const postsTagsLength = await this.page.$$eval(
        "#root > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div:nth-child(3) > div > div",
        (postsTags) => postsTags.length
      );

      isEnd = Number(postsCount.match(/[0-9]+/g)) === postsTagsLength;
    }

    return isEnd;
  }

  async scrollDown(blogType) {
    try {
      await this.page.waitFor(500);
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      const isEnd = await this.checkIsEnd(blogType);
      if (isEnd) {
        await this.page.waitFor(3000);
        this.isEndReached = true;
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  scrollFreeze() {
    this.canScroll = false;
  }

  async open({
    url,
    loadImages = true,
    endpoint,
    blogType,
    evaluateCallBack,
    scraperEmitter,
  }) {
    try {
      this.page = await this.browser.newPage();
      this.page.setViewport({ width: 1280, height: 926 });

      this.page.setRequestInterception(true);
      this.page.on("request", (request) => {
        request.resourceType() === "image" && !loadImages
          ? request.abort()
          : request.continue();
      });

      this.page.on("response", async (res) => {
        // when response received
        const resUrl = res.url();

        if (resUrl.includes(endpoint) && !this.isEndReached) {
          const isEnd = await this.scrollDown(blogType);

          if (isEnd && !this.isScraped) {
            await this.page.exposeFunction(
              "changeDateFormat",
              blogType === "medium"
                ? mediumChangeDateFormat
                : velogChagneDateFormat
            );

            let allPosts = await this.extract(evaluateCallBack);

            scraperEmitter.emit("done", allPosts);
            scraperEmitter.emit("close");
          }
        }
      });

      await this.goTo({ url });
      await this.scrollDown();
    } catch (e) {
      console.error(e);
    }
  }

  async goTo({ url, opts }) {
    try {
      const pageOpts = opts ? opts : { waitLoad: true, waitNetworkIdle: true };
      await this.page.goto(url, pageOpts);
      await this.page.waitFor(100);
    } catch (e) {
      console.error(e);
    }
  }

  async extract(evaluateCallBack) {
    try {
      this.isScraped = true;
      return await this.page.evaluate(evaluateCallBack);
    } catch (e) {
      console.error(e);
    }
  }

  async close() {
    await this.browser.close();
  }
}

module.exports = InfiniteScrollBrowser;
