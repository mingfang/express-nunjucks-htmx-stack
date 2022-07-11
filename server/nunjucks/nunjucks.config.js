const nunjucks = require('nunjucks')
const numeral = require('numeral')
const {DateTime} = require('luxon')
const fetch = require('node-fetch')
const markdown = require('./markdown-tag')

/* Nunjucks Env */

const env = nunjucks.configure('templates', {
  autoescape: false,
  watch: process.env.NODE_ENV === 'development',
})

/* Extensions */
env.addExtension('markdown', markdown(env))

/* Filters */

numeral.nullFormat('')
env.addFilter('numeral', (number, format) => numeral(number).format(format))
env.addFilter('luxon', (date, format) => DateTime.fromISO(date).toFormat(format))
env.addFilter('JSON_parse', JSON.parse)
env.addFilter('await', async (promise, cb) => cb(null, await promise), true)
env.addFilter('log', console.log)

/* Globals */

env.addGlobal('fetch', async (url) => (await fetch(url, {})).text())
env.addGlobal('Math', Math)
env.addGlobal('JSON', JSON)
env.addGlobal('process', process)

/* render using this env */
/* todo: handle errors */
const render = (template, req, res, ctx = {}) => {
  env.render(`${template}.njk`, {req, res, ...ctx}, async (err, fragment) => {
    err && console.log(err)

    res.send(fragment)
  })
}

module.exports = {
  env,
  render,
}