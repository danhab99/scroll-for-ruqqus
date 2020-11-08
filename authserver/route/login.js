const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')

const User = require('../schemas/user')
const requireLogin = require('../requireLogin')

const route = express.Router()

route.use(passport.initialize());
route.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).exec((err, user) => {
    if (err) throw err
    done(null, user)
  })
}); 

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  }, (email, password, done) => {
  User.findOne({email}).then(user => {
    user.validatePassword(password).then(r => {
      if (r) {
        done(null, user)
      }
      else {
        done(false)
      }
    })
  })
}))

route.get('/login', (req, res) => {
  res.render('login', {
    user: null
  })
})

route.get('/register', (req, res) => {
  res.render('register', {
    user: null,
    error: null
  })
})

route.post('/login', 
  bodyParser.urlencoded(),
  passport.authenticate('local', {
    successRedirect: '/',
  }),
  (req, res) => {
    if (!req.user) {
      res.render('login', {
        user: null,
        error: 'Bad email or password'
      })
    }
  }
)

route.use('/logout', requireLogin, (req, res) => {
  req.logout()
  res.redirect('/')
})

route.post('/register', bodyParser.urlencoded(), (req, res) => {
  User.findOne({email: req.body.email}).then(user => {
    if (user) {
      console.log('User already taken')
      res.render('register', {
        user: null,
        error: 'Email already taken'
      })
    }
    else {
      console.log('Registering new user')
      User.create({email: req.body.email}).then(newUser => {
        newUser.setPassword(req.body.password).then(() => {
          req.logIn(newUser, () => {
            res.redirect('/')
          })
        })
      })
    }
  })
})

module.exports = route