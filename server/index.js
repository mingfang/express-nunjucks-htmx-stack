const fs = require('fs')
const path = require('path')
const {server, listen} = require('./express.config')
const {render} = require('./nunjucks/nunjucks.config')

/* python */
const python = require('pythonia').python
let example, pandas
const pyFile = path.resolve(__dirname, '../python/add.py')
const pandasFile = path.resolve(__dirname, '../python/pandas.py')

;(async () => {
    example = await python(pyFile)
    pandas = await python(pandasFile)
  }
)()

server.get('/python/add/:op1/:op2', async (req, res) => {
  const value = await example.add(Number(req.params['op1']), Number(req.params['op2']))
  res.send(`${value}`)
})
server.get('/pandas/random', async (req, res) => {

  res.send(await pandas.random())
})

/* render *.njk files relative to templates dir */

const renderPath = (subPath = '.') =>
  (req, res) => {
    const template = req.params['template'] || 'index'
    render(`${subPath}/${template}`, req, res)
  }

server.get('/:template?', renderPath())

/* render from sub directories */

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
