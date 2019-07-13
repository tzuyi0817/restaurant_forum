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