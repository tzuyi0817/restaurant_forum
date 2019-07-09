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
}

module.exports = categoryService