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
    Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
    })
  },
}

module.exports = commentController