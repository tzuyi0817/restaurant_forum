const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  getUser: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    }).then(user => {
      const total = user.Comments.length
      const FollowerCount = user.Followers.length
      const FollowingCount = user.Followings.length
      const FavoriteCount = user.FavoritedRestaurants.length
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      const restaurantComments = user.Comments.map(comment => comment.Restaurant)
      const filterRest = filterValue(restaurantComments)
      const restaurantCount = filterRest.length

      callback({
        profile: user,
        total,
        restaurantCount,
        FollowingCount,
        FollowerCount,
        FavoriteCount,
        isFollowed,
        filterRest
      })
    })
  },

  editUser: (req, res, callback) => {
    User.findByPk(req.params.id).then(user => {
      callback({ user })
    })
  },

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '用戶名稱未填寫' })
    } else {
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          User.findByPk(req.params.id).then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            }).then(user => {
              callback({ status: 'success', message: '個人資料修改成功' })
            })
          })
        })
      } else {
        User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then(user => {
            callback({ status: 'success', message: '個人資料修改成功' })
          })
        })
      }
    }
  },
}

module.exports = userService

const filterValue = (array) => {
  const restaurant = {}

  return array.filter(value => {
    const string = JSON.stringify(value)
    const match = Boolean(restaurant[string])

    return (match ? false : restaurant[string] = true)
  })
}