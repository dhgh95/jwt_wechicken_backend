const puppeteer = require("puppeteer");
const mediumChangeDateFormat = require("../utils/mediumChangeDateFormat");
const velogChangeDateFormat = require("../utils/velogChangeDateFormat");
const mediumEvaluate = require("./mediumEvaluate");
const velogEvaluate = require("./velogEvaluate");

class InfiniteScrollBrowser {
  constructor(url, blogType, scraperEmitter) {
    this.browser = null;
    this.page = null;
    this.isEndReached = false;
    this.scraperEmitter = scraperEmitter;
    this.url = url;
    this.blogType = blogType;
    this.endpoint =
      blogType === "medium"
        ? "https://medium.com/_/graphql"
        : "https://v2.velog.io/graphql";
  }

  async start(opts) {
    const lauchOpts = opts
      ? opts
      : { headless: true, args: ["--no-sandbox"], devtools: false };
    this.browser = await puppeteer.launch(lauchOpts);
  }

  async open(loadImages = true) {
    try {
      this.page = await this.browser.newPage();
      this.page.setViewport({ width: 1280, height: 926 });
      await this.page.exposeFunction(
        "changeDateFormat",
        this.blogType === "medium"
          ? mediumChangeDateFormat
          : velogChangeDateFormat
      );

      this.page.setRequestInterception(true);
      this.page.on("request", (request) => {
        request.resourceType() === "image" && !loadImages
          ? request.abort()
          : request.continue();
      });

      this.page.on("response", async (res) => {
        const resUrl = res.url();

        if (resUrl.includes(this.endpoint)) await this.scrollDown();
      });

      await this.goTo({ url: this.url });
      await this.scrollDown();
    } catch (e) {
      console.error(e);
    }
  }

  async scrollDown() {
    try {
      await this.page.waitFor(500);
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await this.page.waitForResponse(this.endpoint, {
        timeout: 3000,
      });
    } catch (err) {
      if (!this.isEndReached) {
        const allPosts = await this.page.evaluate(
          this.blogType === "medium" ? mediumEvaluate : velogEvaluate
        );

        this.scraperEmitter.emit("done", allPosts);
        this.scraperEmitter.emit("close");
        this.isEndReached = true;
      }
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

  async close() {
    await this.browser.close();
  }
}

module.exports = InfiniteScrollBrowser;
