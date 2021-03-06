const express = require("express");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan")("dev");

const routes = require("./routes");
const autoTodayUpdatePosts = require("./services/schedule");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(hpp());
app.use(helmet());
app.use(cors());
app.use(logger);
app.use("/images", express.static("images"));

// routes
routes(app);

// 자동 크롤링
autoTodayUpdatePosts;

//middleware

app.use((error, req, res, next) => {
  const { statusCode, message } = error;
  const status = statusCode || 500;
  error.statusCode = statusCode || 500;
  console.log(error);
  res.status(status).json({ message });
});

module.exports = app;
