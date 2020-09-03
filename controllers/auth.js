const { googleAuth, createToken } = require("../services/auth");
const { model } = require("../models");
const { getAllPosts } = require("../scraper");
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
      const { status } = await model["Wecode_nth"].findOne({
        where: { nth: user.wecode_nth },
        attributes: ["status"],
      });
      res.status(201).json({
        message: "SUCCESS",
        token,
        profile: user.user_thumbnail,
        myGroupStatus: status,
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
      is_group_joined,
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
      user_thumbnail: req.file ? req.file.location : user_thumbnail,
      gmail_id,
      gmail,
      is_group_joined,
    };

    await model["Users"].create(additionalInfo);

    const user = await model["Users"].findOne({ where: { gmail_id } });
    const token = createToken(user.id, user.wecode_nth);
    const { status } = await model["Wecode_nth"].findOne({
      where: { nth: wecode_nth },
      attributes: ["status"],
    });
    const profile = user.user_thumbnail;

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
      console.log("DB => saved_post");
    });

    getAllPosts({
      url: blog_address,
      blogType: blog_type,
      scraperEmitter,
    });

    res.status(201).json({
      message: "User created!!!",
      token,
      profile,
      myGroupStatus: status,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { additional, googleLogin };
