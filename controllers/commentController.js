const commentService = require('../services/commentService')

let commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      }
    })
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect(`/restaurants/${data['comment'].RestaurantId}`)
      }
    })
  },
}

module.exports = commentController