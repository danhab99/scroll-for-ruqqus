const express = require('express')
const bodyParser = require('body-parser')

const Site = require('../schemas/site')
const requireLogin = require('../requireLogin')
const { STATES } = require('mongoose')

const route = express.Router()

route.post('/new', requireLogin, bodyParser.urlencoded(), (req, res) => {
  Site.findOne({domain: req.body.domain}).then(site => {
    if (site) {
      res.redirect('/?error=domain already taken')
    }
    else {
      Site.create({
        owner: req.user.id,
        ...req.body
      }).then(newSite => {
        res.redirect('/')
      })
    }
  })
})

route.post('/edit', requireLogin, bodyParser.urlencoded(), (req, res) => {
  Site.update({owner: req.user._id}, req.body).exec((err, site) => {
    res.redirect('/')
  })
})

route.get('/delete', requireLogin, (req, res) => {
  Site.remove({owner: req.user._id}).exec((err, idk) => {
    res.redirect('/')
  })
})

module.exports = route