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

route.get('/authenticate', (req, res) => {
  Site.findOne({_id: req.query.id}).then(site => {
    let link = getAuthURL({
      id: site.clientID,
      redirect: site.redirect,
      state: req.query.state,
      scope: 'identity,create,read,update,delete,vote,guildmaster',
      permanent: true,
      domain: site.domain
    })

    res.redirect(link)
  })
})

module.exports = route