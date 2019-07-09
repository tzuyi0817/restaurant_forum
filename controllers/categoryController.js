const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫分類名稱')
      res.redirect('back')
    } else {
      Category.create({ name: req.body.name }).then(category => {
        req.flash('success_messages', '分類新增成功')
        res.redirect('/admin/categories')
      })
    }
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫分類名稱')
      res.redirect('back')
    } else {
      Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(category => {
          req.flash('success_messages', '分類修改成功')
          res.redirect('/admin/categories')
        })
      })
    }
  },

  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id).then(category => {
      category.destroy().then(category => {
        res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = categoryController