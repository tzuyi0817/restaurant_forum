const db = require('../models')
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(restaurant => {
      res.redirect(`/restaurants/${req.body.RestaurantId}`)
    })
  }
}

module.exports = commentController