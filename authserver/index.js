require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose");
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const rateLimit = require("express-rate-limit")

const Site = require('./schemas/site')

const app = express()

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}))

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  unset: 'destroy',
  saveUninitialized: false,
  rolling: true,
  cookie: { 
    secure: false, 
    maxAge: 6.048e+8, // 1 week
    domain: process.env.DOMAIN
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./route/login'))
app.use('/auth', require('./route/oauth'))
app.use('/sites', require('./route/sites'))

app.get('/', (req, res) => {
  Site.find({}).then(sites => {
    res.render('index', {
      user: req.user,
      mysite: sites.find(x => x.owner.toString() == req.user ?? req.user._id.toString()) || {},
      sites
    })
  })
})

mongoose.connection.on("connecting", () =>
  console.warn(`Connecting to database @ ${process.env.MONGO_SRV}`)
);

mongoose.connection.on("error", err =>
  console.error("mongoose connection", err)
);

mongoose.connection.on("close", () => {
  console.warn("Database closed, shutting down");
  process.exit(1);
});

mongoose.connection.on("open", () => {
  console.log("Mongo database open")
  app.listen('/var/listen.sock', () => console.log('Listening on socket'))
});

mongoose.connect(process.env.MONGO_SRV,
  { useNewUrlParser: true, useUnifiedTopology: true }
);