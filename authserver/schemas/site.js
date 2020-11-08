const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  clientID: {
    type: String,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  }
})

module.exports = Site = mongoose.model('site', siteSchema)