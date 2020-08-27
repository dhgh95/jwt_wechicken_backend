const getAllPosts = require("./getAllPosts");
const mediumEvalute = require("./mediumEvaluate");
const velogEvalute = require("./velogEvaluate");

const medium = {
  url: "https://medium.com/@jun.choi.4928",
  endpoint: "https://medium.com/_/batch",
  blogType: "medium",
  evaluateCallBack: mediumEvalute,
};

const velog = {
  url: "https://velog.io/@yoju",
  endpoint: "https://v2.velog.io/graphql",
  blogType: "velog",
  evaluateCallBack: velogEvalute,
};

getAllPosts(medium);
