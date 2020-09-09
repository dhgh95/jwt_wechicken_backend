const schedule = require("node-schedule");
const { model } = require("../models");
const { getRecentPosts } = require("../scraper");

const todayUpdatePosts = schedule.scheduleJob("0 35 23 * * *", async () => {
  try {
    const users = await model["Users"].findAll({
      attributes: ["id", "blog_address"],
      include: { model: model["Blog_type"], attributes: ["type"] },
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
        return getRecentPosts({ url: blog_address, blog_type: type });
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
          const [date] = await model["Dates"].findOrCreate({
            where: { date: post.date },
            defaults: { date: post.date },
          });

          const blog = {
            title: post.title,
            subtitle: post.subtitle,
            thumbnail: post.thumbnail,
            date_id: date.id,
            user_id: userId,
            link: post.link,
          };

          await model["Blogs"].findOrCreate({
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
