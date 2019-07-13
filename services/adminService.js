const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants })
    })
  },

  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant })
    })
  },

  createRestaurant: (req, res, callback) => {
    Category.findAll().then(categories => {
      callback({ categories })
    })
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: '未填寫餐廳名稱' })
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
          callback({ status: 'success', message: '餐廳新增成功' })
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
        callback({ status: 'success', message: '餐廳新增成功' })
      })
    }
  },

  editRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        callback({ restaurant, categories })
      })
    })
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: '未填寫餐廳名稱' })
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
            callback({ status: 'success', message: '餐廳修改成功' })
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
          callback({ status: 'success', message: '餐廳修改成功' })
        })
      })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(restaurant => {
        callback({ status: 'success', message: '' })
      })
    })
  },

  getUsers: (req, res, callback) => {
    User.findAll().then(users => {
      callback({ users })
    })
  },
}

module.exports = adminService