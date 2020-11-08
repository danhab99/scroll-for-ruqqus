const express = require('express')
const bodyParser = require('body-parser')

const Site = require('../schemas/site')
const requireLogin = require('../requireLogin')

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

module.exports = route