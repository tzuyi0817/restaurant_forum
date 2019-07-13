const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      res.render('restaurant', data)
    })
  },

  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => {
      res.render('feeds', data)
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