const bcrypt = require("bcryptjs");
const { googleAuth, createToken } = require("../services/auth");
const { model } = require("../models");
const getAllPosts = require("../scraper/getAllPosts");
const velogEvalute = require("../scraper/velogEvaluate");
const mediumEvalute = require("../scraper/mediumEvaluate");
const events = require("events");
const scraperEmitter = new events.EventEmitter();

const googleLogin = async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    const googleUser = await googleAuth(googleToken);
    const user = await model["Users"].findOne({
      where: { gmail_id: googleUser.sub },
    });

    if (!user) {
      res.status(201).json({ message: "FIRST" });
    }

    if (user) {
      const token = createToken(user.id, user.wecode_nth);
      res.status(201).json({
        message: "SUCCESS",
        token,
        profile: user.user_thumbnail,
      });
    }
  } catch (err) {
    next(err);
  }
};

const additional = async (req, res, next) => {
  try {
    const {
      user_name,
      blog_address,
      wecode_nth,
      user_thumbnail,
      gmail_id,
      gmail,
    } = req.body;

    await model["Wecode_nth"].findOrCreate({
      where: { nth: wecode_nth },
      default: { nth: wecode_nth },
    });

    const blog_type = blog_address.match(/[a-z]+/g)[1];
    const [{ id }] = await model["Blog_type"].findOrCreate({
      where: { type: blog_type },
      default: { type: blog_type },
    });

    const additionalInfo = {
      user_name,
      blog_address,
      blog_type_id: id,
      wecode_nth,
      user_thumbnail: req.file ? req.file.path : user_thumbnail,
      gmail_id,
      gmail,
    };

    await model["Users"].create(additionalInfo);
    const user = await model["Users"].findOne({ where: { gmail_id } });
    const token = createToken(user.id, user.wecode_nth);

    scraperEmitter.once("done", async (allPosts) => {
      for (post of allPosts) {
        const [date] = await model["Dates"].findOrCreate({
          where: { date: post.date },
          defaults: { date: post.date },
        });

        const blog = {
          ...post,
          date_id: date.id,
          user_id: user.id,
        };

        await model["Blogs"].create(blog);
      }
      const postTitle = allPosts[allPosts.length - 1].title;
      const postDate = allPosts[allPosts.length - 1].date;
      const recent_scraped = gmail + postTitle + postDate;
      await model["Users"].update({ recent_scraped }, { where: { gmail_id } });
      console.log("DB => saved_post");
    });

    getAllPosts({
      url: blog_address,
      endpoint:
        blog_type === "velog"
          ? "https://v2.velog.io/graphql"
          : "https://medium.com/_/batch",
      blogType: blog_type,
      evaluateCallBack: blog_type === "velog" ? velogEvalute : mediumEvalute,
      scraperEmitter,
    });

    res.status(201).json({ message: "User created!!!", token });
  } catch (err) {
    next(err);
  }
};

module.exports = { additional, googleLogin };
