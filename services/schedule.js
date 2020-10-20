const schedule = require("node-schedule");
const { Users, Blog_type, Dates, Blogs } = require("../models");
const { getRecentPosts } = require("../scraper");

const todayUpdatePosts = schedule.scheduleJob("0 35 23 * * *", async () => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "blog_address"],
      include: { model: Blog_type, attributes: ["type"] },
    });

    const arrayToChucks = (array, CHUNKSIZE) => {
      const results = [];
      for (let i = 0; i < array.length; i += CHUNKSIZE) {
        results.push(array.slice(i, i + CHUNKSIZE));
      }

      return results;
    };

    const usersId = users.map(({ id }) => id);
    const postsPromise = arrayToChucks(
      users.map(({ blog_address, blog_type: { type } }) => {
        return getRecentPosts({ url: blog_address, blogType: type });
      }),
      4
    );

    let posts = [];
    for (let chunkPostsPromise of postsPromise) {
      posts = [...posts, ...(await Promise.all(chunkPostsPromise))];
    }

    const usersToPosts = usersId.map((userId, index) => {
      return { userId, posts: posts[index] };
    });

    if (posts) {
      for (let { userId, posts } of usersToPosts) {
        for (let post of posts) {
          const [date] = await Dates.findOrCreate({
            where: { date: post.date },
            defaults: { date: post.date },
          });

          const blog = {
            title: post.title,
            subtitle: post.subtitle,
            thumbnail: post.thumbnail,
            dateId: date.id,
            userId,
            link: post.link,
          };

          await Blogs.findOrCreate({
            where: { title: post.title },
            defaults: blog,
          });
        }
      }
    }
    console.log("DB -> save");
  } catch (err) {
    console.log(err);
  }
});

module.exports = todayUpdatePosts;
