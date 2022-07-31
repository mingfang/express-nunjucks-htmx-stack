const express = require('express')
const server = express()

/* public static */
server.use('/', express.static('public'))
server.use('/', express.static('dist'))
/* for missing favicon */
server.get('/favicon.ico', (req, res) => res.sendStatus(204));

/* debug params and query */
if( process.env.NODE_ENV==='development') {
  server.get('/_debug/:param?', (req, res) => res.send({
    params: req.params,
    query: req.query,
    env: process.env,
  }))
}

/* start */
const port = process.env.PORT || 3000
const listen = ()=> {
  server.listen(port, ()=> {
    console.log(`Express Server listening on port: ${port}`)
  })
}

module.exports = {
  server,
  listen,
}