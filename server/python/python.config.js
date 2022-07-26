const fs = require('fs')
const path = require('path')
const python = require('pythonia').python

const config = async () => {
  const addFile = path.resolve(__dirname, './add.py')
  const pandasFile = path.resolve(__dirname, './pandas.py')

  let add = await python(addFile)
  let pandas = await python(pandasFile)
  return {
    add,
    pandas,
  }
}

module.exports = {
  config,
}


