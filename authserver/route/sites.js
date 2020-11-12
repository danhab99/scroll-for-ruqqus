const express = require('express')
const bodyParser = require('body-parser')

const Site = require('../schemas/site')
const requireLogin = require('../requireLogin')

const route = express.Router()

route.get('/', (req, res) => {
  Site.find({}).select(['domain', 'name', 'clientID']).then(list => res.json(list))
})

route.post('/new', requireLogin, bodyParser.urlencoded(), (req, res) => {
  Site.findOneAndUpdate(
    {owner: req.user._id}, 
    req.body, 
    { 
      new: true,
      upsert: true
    }
  ).then(() => {
    res.redirect('/')
  })
})

route.get('/delete', requireLogin, (req, res) => {
  Site.remove({owner: req.user._id}).exec((err, idk) => {
    res.redirect('/')
  })
})

module.exports = route