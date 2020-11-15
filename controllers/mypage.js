const { Blogs, Blog_type, Users, Dates } = require('../models')

const getMyPage = async (req, res, next) => {
  try {
    const {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
      is_group_joined,
    } = req.user

    const mypage = {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
      is_group_joined,
    }

    res.status(200).json({ message: 'SUCCESS', mypage })
  } catch (err) {
    next(err)
  }
}

const modifyMyProfile = async (req, res, next) => {
  try {
    const { blog_address } = req.body
    const { leave } = req.query

    const modifyProfile = {
      user_thumbnail: req.file?.location,
      blog_address,
      is_group_joined: leave === 'group' && false,
    }

    const { id } = req.user
    await Users.update(modifyProfile, { where: { id } })

    res.status(200).json({ message: 'MODIFY', profile: req.file?.location })
  } catch (err) {
    next(err)
  }
}

const deleteMyProfile = async (req, res, next) => {
  try {
    const { deleted } = req.query
    const { id } = req.user

    if (deleted === 'user_thumbnail') {
      await Users.update({ user_thumbnail: null }, { where: { id } })
    }

    res.status(200).json({ message: 'DELETE' })
  } catch (err) {
    next(err)
  }
}

const getMyPostsView = async (req, res, next) => {
  try {
    const { id } = req.user
    const posts = await Users.findOne({
      where: { id },
      attributes: ['user_name', 'user_thumbnail', 'wecode_nth'],
      include: [
        { model: Blog_type, attributes: ['type'] },
        {
          model: Blogs,
          attributes: ['title', 'subtitle', 'thumbnail', 'link', 'id'],
          include: { model: Dates, attributes: ['date'] },
        },
      ],
    })

    const myPosts = posts.blogs.map((post) => {
      return {
        title: post.title,
        date: post.date.date,
        link: post.link,
        thumbnail: post.thumbnail,
        user_name: posts.user_name,
        user_profile: posts.user_thumbnail,
        type: posts.blog_type.type,
        id: post.id,
        nth: posts.wecode_nth,
      }
    }).sort((a,b) => Number(b.date.replace(/\./g, ""))-Number(a.date.replace(/\./g, "")))

    res.status(200).json({ message: 'MY POSTS', myPosts })
  } catch (err) {
    next(err)
  }
}

const editPost = async (req, res, next) => {
  try {
    const { id: userIdFromToken } = req.user
    const { postId } = req.params
    const { title, link, date } = req.body

    const [foundOrCreatedDate] = await Dates.findOrCreate({
      where: { date },
      defaults: { date },
    })

    const [result] = await Blogs.update(
      {
        title: title,
        link: link,
        date_id: foundOrCreatedDate.id,
      },
      {
        where: {
          id: postId,
        },
        include: {
          model: Users,
          where: {
            id: userIdFromToken,
          },
        },
      }
    )

    res
      .status(201)
      .json({ message: result ? 'successfully updated' : 'failed' })
  } catch (err) {
    next(err)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const { id: userIdFromToken } = req.user
    const { postId } = req.params
    console.log(userIdFromToken, postId)

    const result = await Blogs.destroy({
      where: {
        id: postId,
      },
      include: {
        model: Users,
        where: {
          id: userIdFromToken,
        },
      },
    })

    res
      .status(201)
      .json({ message: result ? 'successfully deleted' : 'failed' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMyPage,
  modifyMyProfile,
  deleteMyProfile,
  getMyPostsView,
  editPost,
  deletePost,
}
