const puppeteerInfiniteScroll = require("./puppeter-infinite-scroll");
const events = require("events");

module.exports = async function ({
  url,
  endpoint,
  blogType,
  evaluateCallBack,
  scraperEmitter,
}) {
  try {
    console.log("browser start");
    const browser = new puppeteerInfiniteScroll();
    scraperEmitter.once("close", async () => {
      await browser.close();
      console.log("browser closed");
    });
    await browser.start();
    await browser.open({
      url,
      endpoint,
      blogType,
      evaluateCallBack,
      scraperEmitter,
    });
  } catch (e) {
    console.error(e);
  }
};
