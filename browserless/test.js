const puppeteer = require('puppeteer-core')

;(async ()=> {
  const browser = await puppeteer.connect({browserWSEndpoint: 'ws://browserless.browserless-example:3000'})
  const page = await browser.newPage()

  await page.goto('http://httpbin.httpbin:5000')
})()