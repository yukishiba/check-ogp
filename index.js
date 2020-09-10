const axios = require('axios')
const cheerio = require('cheerio')
const list = require('./list.json')
const fs = require('fs')
const outputPaht = './output.csv'
let output = 'URL,og:image,備考\n'

async function wait (second) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve()
    }, second)
  })
}

async function main () {
  for (const entry of list) {
    await wait(1000);
    try {
      const res = await axios.get(entry.url)
      const $ = cheerio.load(res.data)
      const ogimage = $('meta[property="og:image"]').attr('content')
      console.log('get:' + entry.url)
      output += entry.url + ',' + ogimage + ',' + entry.description + '\n'
    }
    catch (error){
      console.error('error:' + entry.url)
      output += entry.url + ',' + 'ERROR' + ',' + entry.description + '\n'
    }
  }
  fs.writeFile(outputPaht, output, 'utf-8', () => {
    console.log('output: ' + outputPaht)
  })
}

main();