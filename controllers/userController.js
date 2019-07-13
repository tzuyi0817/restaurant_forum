const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userService = require('../services/userService')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      res.render('user', data)
    })
  },

  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      res.render('edit', data)
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '用戶名稱未填寫')
      res.redirect('back')
    } else {
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          User.findByPk(req.params.id).then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            }).then(user => {
              req.flash('success_messages', '個人資料修改成功')
              res.redirect(`/users/${req.params.id}`)
            })
          })
        })
      } else {
        User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then(user => {
            req.flash('success_messages', '個人資料修改成功')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      }
    }
  },

  addFavorite: (req, res) => {
    Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    Favorite.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } }).then(favorite => {
      favorite.destroy().then(restaurant => {
        res.redirect('back')
      })
    })
  },

  addLike: (req, res) => {
    Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } }).then(like => {
      like.destroy().then(restaurant => {
        res.redirect('back')
      })
    })
  },

  getTopUser: (req, res) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      res.render('topUser', { users })
    })
  },

  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(followship => {
      res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        res.redirect('back')
      })
    })
  }
}

module.exports = userController

const filterValue = (array) => {
  const restaurant = {}

  return array.filter(value => {
    const string = JSON.stringify(value)
    const match = Boolean(restaurant[string])

    return (match ? false : restaurant[string] = true)
  })
}