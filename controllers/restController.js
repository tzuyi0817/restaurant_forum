const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
      restaurant.increment('viewCounts', { by: 1 }).then(restaurant => {
        res.render('restaurant', { restaurant, isFavorited, isLike })
      })
    })
  },

  getFeeds: (req, res) => {
    Restaurant.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Category] }).then(restaurants => {
      Comment.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [User, Restaurant] }).then(comments => {
        res.render('feeds', { restaurants, comments })
      })
    })
  },

  getDashboard: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [Restaurant] },
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurant => {
      const total = restaurant.Comments.length
      const FavoriteCount = restaurant.FavoritedUsers.length
      res.render('dashboard', { restaurant, total, FavoriteCount })
    })
  },

  getTopRestaurant: (req, res) => {
    Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        FavoriteCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount)
      restaurants = restaurants.slice(0, 10)
      res.render('topRestaurant', { restaurants })
    })
  }
}

module.exports = restController