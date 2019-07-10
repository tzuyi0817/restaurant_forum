const db = require('../models')
const Category = db.Category

let categoryService = {
  getCategories: (req, res, callback) => {
    Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          callback({ categories, category })
        })
      } else
        callback({ categories })
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '未填寫分類名稱' })
    } else {
      Category.create({ name: req.body.name }).then(category => {
        callback({ status: 'success', message: '分類新增成功' })
      })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '未填寫分類名稱' })
    } else {
      Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(category => {
          callback({ status: 'success', message: '分類修改成功' })
        })
      })
    }
  },
}

module.exports = categoryService