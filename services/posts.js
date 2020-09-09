const { model } = require("../models");

const getLikedOrBookmarkPosts = async ({ userId, selectModel }) => {
  const likedOrBookmarkedPosts = await model["Users"].findOne({
    where: { id: userId },
    attributes: ["user_name"],
    include: {
      model: model[selectModel],
      where: { status: true },
      attributes: ["status"],
      include: {
        model: model["Blogs"],
        attributes: ["title", "subtitle", "thumbnail", "link", "id"],
        include: [
          { model: model["Dates"], attributes: ["date"] },
          {
            model: model["Users"],
            attributes: ["wecode_nth", "user_name", "user_thumbnail"],
            include: { model: model["Blog_type"], attributes: ["type"] },
          },
        ],
      },
    },
  });

  const isOtherStatus = async (postId, selectModel) => {
    const changeStr = { Likes: "Bookmarks", Bookmarks: "Likes" };
    const likeOrBookmarkStatus = await model[changeStr[selectModel]].findOne({
      where: { blog_id: postId },
      attributes: ["status"],
    });

    return likeOrBookmarkStatus ? likeOrBookmarkStatus.status : false;
  };

  changeKey = { Likes: "likes", Bookmarks: "bookmarks" };
  let posts = [];
  if (likedOrBookmarkedPosts) {
    for (let post of likedOrBookmarkedPosts[changeKey[selectModel]]) {
      const otherStatus = await isOtherStatus(post.blog.id, selectModel);
      const likedOrBookmarkedPost = {
        id: post.blog.id,
        title: post.blog.title,
        subtitle: post.blog.subtitle,
        link: post.blog.link,
        thumbnail: post.blog.thumbnail,
        date: post.blog.date.date,
        user_name: post.blog.user.user_name,
        user_profile: post.blog.user.user_thumbnail,
        nth: post.blog.user.wecode_nth,
        type: post.blog.user.blog_type.type,
        like: selectModel === "Likes" ? post.status : otherStatus,
        bookmark: selectModel === "Bookmarks" ? post.status : otherStatus,
      };
      posts = [...posts, likedOrBookmarkedPost];
    }
  }

  return posts;
};

const isLikeOrBookmark = async ({ userId, blogId, selectModel }) => {
  const likeOrBookmarkedPost = await model[selectModel].findOne({
    where: { user_id: userId, blog_id: blogId },
    attributes: ["status"],
  });

  if (likeOrBookmarkedPost) {
    await model[selectModel].update(
      { status: !likeOrBookmarkedPost.status },
      { where: { user_id: userId, blog_id: blogId } }
    );
  }

  if (!likeOrBookmarkedPost) {
    const likeOrBookmarkPost = {
      user_id: userId,
      blog_id: blogId,
    };
    await model[selectModel].create(likeOrBookmarkPost);
  }
};

module.exports = { getLikedOrBookmarkPosts, isLikeOrBookmark };
