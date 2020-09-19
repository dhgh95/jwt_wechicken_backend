const InfiniteScrollBrowser = require("./InfiniteScrollBrowser");

module.exports = async function ({ url, blogType, scraperEmitter }) {
  try {
    console.log("Infinite scroll browser start");
    const browser = new InfiniteScrollBrowser(url, blogType, scraperEmitter);

    scraperEmitter.once("close", async () => {
      await browser.close();
      console.log("Infinite scroll browser closed");
    });

    await browser.start();
    await browser.open();
  } catch (e) {
    console.error(e);
  }
};
