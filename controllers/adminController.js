const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫餐廳名稱')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          req.flash('success_messages', '餐廳新增成功')
          res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then(restaurant => {
        req.flash('success_messages', '餐廳新增成功')
        res.redirect('/admin/restaurants')
      })
    }
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      res.render('admin/restaurant', { restaurant })
    })
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        res.render('admin/create', { restaurant, categories })
      })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫餐廳名稱')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          }).then(restaurant => {
            req.flash('success_messages', '餐廳新增成功')
            res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          req.flash('success_messages', '餐廳修改成功')
          res.redirect('/admin/restaurants')
        })
      })
    }
  },

  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(restaurant => {
        res.redirect('/admin/restaurants')
      })
    })
  },

  getUsers: (req, res) => {
    User.findAll().then(users => {
      res.render('admin/user', { users })
    })
  },

  putUsers: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      if (user.isAdmin === true) {
        user.isAdmin = false
      } else if (user.isAdmin === false) {
        user.isAdmin = true
      }
      user.save().then(user => {
        req.flash('success_messages', '權限修改成功')
        res.redirect('/admin/users')
      })
    })
  }
}



module.exports = adminController