const getAllPosts = require("./getAllPosts");
const mediumEvalute = require("./mediumEvaluate");
const velogEvalute = require("./velogEvaluate");
const events = require("events");

const scraperEmitter = new events.EventEmitter();
scraperEmitter.once("done", async (allPosts) => {
  // allPosts to fix
  console.log(allPosts);
});

const medium = {
  url: "https://medium.com/@jun.choi.4928",
  endpoint: "https://medium.com/_/batch",
  blogType: "medium",
  evaluateCallBack: mediumEvalute,
  scraperEmitter,
};

const velog = {
  url: "https://velog.io/@yoju",
  endpoint: "https://v2.velog.io/graphql",
  blogType: "velog",
  evaluateCallBack: velogEvalute,
  scraperEmitter,
};

getAllPosts(medium);
