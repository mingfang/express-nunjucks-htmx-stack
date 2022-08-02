const fs = require('fs')
const path = require('path')
const {server, listen} = require('./express.config')
const {env, render} = require('./nunjucks/nunjucks.config')
const {config: pythonConfig} = require('./python/python.config')

let add
let pandas

;(async ()=>{
  ({add, pandas} = await pythonConfig())

  env.addGlobal('add', add)
  env.addGlobal('pandas', pandas)
})()

server.get('/python/add/:op1/:op2', async (req, res) => {
  const value = await add.add(Number(req.params['op1']), Number(req.params['op2']))
  res.send(`${value}`)
})
server.get('/pandas/random', async (req, res) => {
  res.send(await pandas.random())
})


const renderPath = (subPath = '.') =>
  (req, res) => {
    const template = req.params['template'] || 'index'
    render(`${subPath}/${template}`, req, res)
  }

/* render *.njk files relative to templates dir */
server.all('/:template?', renderPath())

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
  server.all(`/${subPath}/:template?`, renderPath(subPath))
})

/* start */
listen()
