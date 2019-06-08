const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫餐廳名稱')
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then(restaurant => {
      req.flash('success_messages', '餐廳新增成功')
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      res.render('admin/restaurant', { restaurant })
    })
  }
}

module.exports = adminController