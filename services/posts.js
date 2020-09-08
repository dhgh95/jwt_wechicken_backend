const { model } = require("../models");

const getLikedOrBookmarkPosts = async ({ userId, selectType }) => {
  const likedOrBookmarkedPosts = await model["Users"].findOne({
    where: { id: userId },
    attributes: ["user_name"],
    include: {
      model: model["Blogs"],
      as: selectType,
      attributes: ["title", "subtitle", "thumbnail", "link", "id"],
      include: [
        { model: model["Dates"], attributes: ["date"] },
        {
          model: model["Users"],
          attributes: ["wecode_nth", "user_name", "user_thumbnail"],
          include: { model: model["Blog_type"], attributes: ["type"] },
        },
      ],
      through: {
        attributes: ["status"],
        where: { status: true },
      },
    },
  });

  const isOtherStatus = async (postId, selectType) => {
    const changeStr = { like: "Bookmarks", bookmark: "Likes" };
    const likeOrBookmarkStatus = await model[changeStr[selectType]].findOne({
      where: { blog_id: postId },
      attributes: ["status"],
    });

    return likeOrBookmarkStatus ? likeOrBookmarkStatus.status : false;
  };

  let posts = [];
  for (let post of likedOrBookmarkedPosts[selectType]) {
    const otherStatus = await isOtherStatus(post.id, selectType);
    const likedOrBookmarkedPost = {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      link: post.link,
      thumbnail: post.thumbnail,
      date: post.date.date,
      user_name: post.user.user_name,
      user_profile: post.user.user_thumbnail,
      nth: post.user.wecode_nth,
      type: post.user.blog_type.type,
      like: post.likes ? post.likes.status : otherStatus,
      bookmark: post.bookmarks ? post.bookmarks.status : otherStatus,
    };
    posts = [...posts, likedOrBookmarkedPost];
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
