const db = require('../models')
const Comment = db.Comment

let commentService = {
  postComment: (req, res, callback) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(restaurant => {
      callback({ status: 'success', message: '' })
    })
  },

  deleteComment: (req, res, callback) => {
    Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        callback({ status: 'success', message: '', comment })
      })
    })
  },
}

module.exports = commentService