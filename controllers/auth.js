const { googleAuth, createToken } = require("../services/auth");
const { Users, Wecode, Blog_type, Dates, Blogs } = require("../models");
const { getAllPosts } = require("../scraper");
const events = require("events");

const googleLogin = async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    const googleUser = await googleAuth(googleToken);
    const user = await Users.findOne({
      where: { gmail_id: googleUser.sub },
    });

    if (!user) {
      res.status(201).json({ message: "FIRST" });
    }

    if (user) {
      const token = createToken(user.id, user.wecode_nth);
      const { status, user_id } = await Wecode.findOne({
        where: { nth: user.wecode_nth },
        attributes: ["status", "user_id"],
      });
      res.status(201).json({
        message: "SUCCESS",
        token,
        profile: user.user_thumbnail,
        myGroupStatus: status,
        nth: user.wecode_nth,
        master: user.id === user_id ? true : false,
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

    const [findOrCreateWecode] = await Wecode.findOrCreate({
      where: { nth: wecode_nth },
      default: { nth: wecode_nth },
    });

    const blog_type = blog_address.match(/[a-z]+/g)[1];
    const [findOrCreateBlogType] = await Blog_type.findOrCreate({
      where: { type: blog_type },
      default: { type: blog_type },
    });

    const additionalInfo = {
      user_name,
      blog_address,
      user_thumbnail: req.file ? req.file.location : user_thumbnail,
      gmail_id,
      gmail,
      is_group_joined,
    };

    const createUser = await Users.create(additionalInfo);
    await findOrCreateWecode.addUser(createUser);
    await findOrCreateBlogType.addUser(createUser);

    const user = await Users.findOne({
      where: { gmail_id },
      include: { model: Wecode, attributes: ["status"] },
    });
    const token = createToken(user.id, user.wecode_nth);
    const profile = user.user_thumbnail;

    const scraperEmitter = new events.EventEmitter();
    scraperEmitter.once("done", async (allPosts) => {
      for (post of allPosts) {
        const [findOrCreateDate] = await Dates.findOrCreate({
          where: { date: post.date },
          defaults: { date: post.date },
        });

        if (post.link.split("/")[3] === blog_address.split("/")[3]) {
          const createBlog = await Blogs.create(post);
          await findOrCreateDate.addBlog(createBlog);
          await user.addBlog(createBlog);
        }
      }
      console.log("DB => saved_post");
    });

    blog_type === "velog" &&
      getAllPosts({
        url: blog_address,
        blogType: blog_type,
        scraperEmitter,
      });

    res.status(201).json({
      message: "User created!!!",
      token,
      profile,
      myGroupStatus: user.wecode.status,
      nth: user.wecode_nth,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { additional, googleLogin };
