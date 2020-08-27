const puppeteerInfiniteScroll = require("./puppeter-infinite-scroll");

module.exports = async function ({
  url,
  endpoint,
  blogType,
  evaluateCallBack,
}) {
  try {
    const browser = new puppeteerInfiniteScroll();
    await browser.start();
    await browser.open({
      url,
      endpoint,
      blogType,
      evaluateCallBack,
    });
  } catch (e) {
    console.error(e);
  }
};
