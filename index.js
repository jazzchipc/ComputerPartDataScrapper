const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const createFile = function (filePath, content) {
  const fileDir = './rankings'

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir)
  }

  fs.writeFile(fileDir + path.sep + filePath, content, function (err) {
    if (err) { throw err }
    console.log('Saved file ' + filePath)
  })
}

const main = function () {
  axios.get('https://www.cpubenchmark.net/laptop.html').then(function (response) {
    if (response.status === 200) {
      var $ = cheerio.load(response.data)

      var rankingString = ''
      var currentRank = 1

      // Skip first child, because it is the header of the table
      $('#mark tr:not(:first-child)').each(function (i, elem) {
        var currentCPU

        currentCPU = $(elem).find('td:first-child a').text()

        rankingString += currentRank + ',' + currentCPU + '\n'

        currentRank++
      })

      createFile('cpu.csv', rankingString)
    } else {
      console.error('Bad response status.\n' + response.status)
    }
  }).catch(function (error) {
    console.error(error)
  })
}

main()
