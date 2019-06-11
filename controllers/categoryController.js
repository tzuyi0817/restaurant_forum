const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    Category.findAll().then(categories => {
      res.render('admin/categories', { categories })
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
  }
}

module.exports = categoryController