const express = require('express')
const { URL } = require('url')
const fetch = require('node-fetch')

const Site = require('../schemas/site')
const bodyParser = require('body-parser')

const route = express.Router()

const APPROVED_APP_REDIRECTS = JSON.parse(process.env.APP_REDIRECTS)

route.get('/:id', (req, res) => {
  if (!APPROVED_APP_REDIRECTS.includes(req.query.redirect)) {
    res.status(401).json({
      'oauth_error': 'invalid redirect'
    })
    return
  }

  Site.findById(req.params.id).exec((err, site) => {
    if (err || !site) {
      res.status(404).json({err: 'Site does not exist'})
    }
    else {
      let url = new URL(`https://${site.domain}/oauth/authorize`)
      url.searchParams.append('client_id', site.clientID)
      url.searchParams.append('client_secret', site.clientSecret)
      url.searchParams.append('redirect_uri', `https://${process.env.DOMAIN}/auth/${req.params.id}/callback`)
      url.searchParams.append('scope', ["identity", "create", "read", "update", "delete", "vote", "guildmaster"].join(','))
      url.searchParams.append('permanent', 'true')
      url.searchParams.append('state', JSON.stringify({
        o: req.query.state,
        r: req.query.redirect
      }))

      res.redirect(url.toString())
    }
  })
})

route.get('/:id/callback', (req, res) => {
  Site.findById(req.params.id).exec((err, site) => {
    if (err || !site) {
      res.status(404).json({err: 'Site does not exist'})
    }
    else {
      let f = fetch(`https://${site.domain}/oauth/grant`, {
        method: 'POST',
        body: `code=${req.query.code}&client_id=${site.clientID}&client_secret=${site.clientSecret}&grant_type=code`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      var unpackState = JSON.parse(req.query.state)

      f.then(rsp => rsp.text())
        .then(text => {
          let r = text
          try {
            r = {
              ...JSON.parse(text),
              state: unpackState.o
            }
          }
          catch (e) {

          }
          finally {
            // res.send(r)
            // res.redirect(`${unpackState.r}?`)

            res.writeHead(301, 'Redirect', {
              Location: `${unpackState.r}?`
            })
            res.write(JSON.stringify(r))
            res.end()
          }
        })

      f.catch(e => res.status(500).json({err: e}))
    }
  })
})

route.post('/:id/refresh', bodyParser.json(), (req, res) => {
  Site.findById(req.params.id).exec((err, site) => {
    if (err || !site) {
      res.status(404).json({err: 'Site does not exist'})
    }
    else {
      let f = fetch(`https://${site.domain}/oauth/grant`, {
        method: 'POST',
        body: `refresh_token=${req.body.refresh_token}&client_id=${site.clientID}&client_secret=${site.clientSecret}&grant_type=refresh`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      f.then(rsp => rsp.text())
        .then(text => {
          let r = text
          try {
            r = {
              ...JSON.parse(text),
              state: req.query.state
            }
          }
          catch (e) {

          }
          finally {
            res.send(r)
          }
        })

      f.catch(e => res.status(500).json({err: e}))
    }
  })
})

module.exports = route