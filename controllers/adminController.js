const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      res.render('admin/restaurant', data)
    })
  },

  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_message', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      res.render('admin/create', data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      res.render('admin/user', data)
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