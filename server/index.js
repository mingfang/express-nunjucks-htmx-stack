const {server, listen} = require('./express.config')
const {render} = require('./nunjucks/nunjucks.config')

/* render *.njk files relative to templates dir */

const renderPath = (subPath = '.') =>
  (req, res) => {
    const template = req.params['template'] || 'index'
    render(`${subPath}/${template}`, req, res)
  }

server.get('/:template?', renderPath())

/* render from sub directories */

const fs = require('fs')
const path = require('path')

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.resolve(dir, f)
    if (fs.statSync(dirPath).isDirectory() && !path.basename(dirPath).startsWith('_')) {
      callback(dirPath)
      walkDir(dirPath, callback)
    }
  })
}

const basePath = path.resolve(__dirname, '../templates')
walkDir(basePath, filePath => {
  const subPath = filePath.substring(basePath.length + 1)
  server.get(`/${subPath}/:template?`, renderPath(subPath))
})

/* start */
listen()
