const InfiniteScrollBrowser = require("./InfiniteScrollBrowser");
const velogEvalute = require("./velogEvaluate");
const mediumEvalute = require("./mediumEvaluate");

module.exports = async function ({ url, blogType, scraperEmitter }) {
  try {
    console.log("Infinite scroll browser start");
    const browser = new InfiniteScrollBrowser();

    scraperEmitter.once("close", async () => {
      await browser.close();
      console.log("Infinite scroll browser closed");
    });

    await browser.start();

    await browser.open({
      url,
      endpoint:
        blogType === "velog"
          ? "https://v2.velog.io/graphql"
          : "https://medium.com/_/batch",
      blogType,
      evaluateCallBack: blogType === "velog" ? velogEvalute : mediumEvalute,
      scraperEmitter,
    });
  } catch (e) {
    console.error(e);
  }
};
