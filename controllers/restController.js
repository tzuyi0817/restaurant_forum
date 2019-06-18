const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
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
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next })
      })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      restaurant.increment('viewCounts', { by: 1 }).then(restaurant => {
        res.render('restaurant', { restaurant, isFavorited })
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
    Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [Restaurant] }] }).then(restaurant => {
      const total = restaurant.Comments.length
      res.render('dashboard', { restaurant, total })
    })
  }
}

module.exports = restController