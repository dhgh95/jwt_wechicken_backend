const {
  Blogs,
  Users,
  Blog_type,
  Dates,
  Likes,
  Bookmarks,
} = require('../models')

const getMainPosts = async (req, res, next) => {
  try {
    const user = req.user
    const { size = 10, page = 0 } = req.query

    const allPosts = await Blogs.findAll({
      offset: Number(size) * Number(page),
      limit: Number(size),
      attributes: ['title', 'subtitle', 'thumbnail', 'link', 'id'],
      include: [
        {
          model: Users,
          attributes: ['user_name', 'user_thumbnail', 'wecode_nth'],
          include: { model: Blog_type, attributes: ['type'] },
        },
        {
          model: Dates,
          attributes: ['date'],
        },
      ],
      order: [[{ model: Dates }, 'date', 'DESC']],
    })

    let posts = []

    for (basicPost of allPosts) {
      let isLikedPost = {}
      let isBookMarkedPost = {}
      if (user) {
        isLikedPost = await Likes.findOne({
          where: { user_id: user.id, blog_id: basicPost.id },
          attributes: ['status'],
        })
        isBookMarkedPost = await Bookmarks.findOne({
          where: { user_id: user.id, blog_id: basicPost.id },
          attributes: ['status'],
        })
      }
      const post = {
        title: basicPost.title,
        subtitle: basicPost.subtitle,
        date: basicPost.date.date,
        link: basicPost.link,
        thumbnail: basicPost.thumbnail,
        user_name: basicPost.user.user_name,
        user_profile: basicPost.user.user_thumbnail,
        type: basicPost.user.blog_type.type,
        id: basicPost.id,
        nth: basicPost.user.wecode_nth,
        like: (user && isLikedPost?.status) || false,
        bookmark: (user && isBookMarkedPost?.status) || false,
      }
      posts = [...posts, post]
    }

    res.status(200).json({ message: 'MAIN', posts })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMainPosts }
