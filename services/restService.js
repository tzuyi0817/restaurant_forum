const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restService = {
  getRestaurants: (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        callback({
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        })
      })
    })
  },

  getRestaurant: (req, res, callback) => {
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
        callback({ restaurant, isFavorited, isLike })
      })
    })
  },

  getFeeds: (req, res, callback) => {
    Restaurant.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [Category] }).then(restaurants => {
      Comment.findAll({ limit: 10, order: [['createdAt', 'DESC']], include: [User, Restaurant] }).then(comments => {
        callback({ restaurants, comments })
      })
    })
  },

  getDashboard: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [Restaurant] },
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurant => {
      const total = restaurant.Comments.length
      const FavoriteCount = restaurant.FavoritedUsers.length
      callback({ restaurant, total, FavoriteCount })
    })
  },

  getTopRestaurant: (req, res, callback) => {
    Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        FavoriteCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount)
      restaurants = restaurants.slice(0, 10)
      callback({ restaurants })
    })
  },
}

module.exports = restService