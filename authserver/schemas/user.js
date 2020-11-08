const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    requried: true
  },
  password: {
    type: String
  },
})

userSchema.method('setPassword', function(password) {
  return new Promise(resolve => {
    bcrypt.hash(password, 10, (err, hash) => {
      this.password = hash
      this.save(() => resolve())
    })
  })
})

userSchema.method('validatePassword', function(attempt) {
  return new Promise(resolve => {
    bcrypt.compare(attempt, this.password, (err, res) => {
      resolve(!(err || !res))
    })
  })
})

module.exports = User = mongoose.model('User', userSchema)