const {server, listen} = require('./express.config')
const {render} = require('./nunjucks/nunjucks.config')

/* render template */
server.get('/:template?', (req, res) => {
  const template = req.params['template'] || 'index'
  render(template, req, res)
})

/* start */
listen()