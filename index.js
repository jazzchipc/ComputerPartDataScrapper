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

const getCPUs = function () {
  axios.get('https://www.cpubenchmark.net/laptop.html').then(function (response) {
    if (response.status === 200) {
      var $ = cheerio.load(response.data)

      var rankingString = ''
      var currentRank = 1

      // Skip first child, because it is the header of the table
      $('#mark tr:not(:first-child)').each(function (i, elem) {
        var currentCPU

        currentCPU = $(elem).find('td:first-child a').text()

        if (currentCPU.length === 0) {
          return true // if the CPU has no name, skip it
        }

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

const getGPUs = function () {
  axios.get('https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&showClassDescription=1&archive=1&perfrating=1&or=0&gpu_fullname=1').then(function (response) {
    if (response.status === 200) {
      var $ = cheerio.load(response.data)

      var rankingString = ''
      var currentRank = 1

      // Skip first child, because it is the header of the table
      $('#sortierbare_tabelle tr.odd').each(function (i, elem) {
        var currentGPU

        currentGPU = $(elem).find('td a').text()

        if (currentGPU.length === 0) {
          return true // if the GPU has no name, skip it
        }

        rankingString += currentRank + ',' + currentGPU + '\n'

        currentRank++
      })

      createFile('gpu.csv', rankingString)
    } else {
      console.error('Bad response status.\n' + response.status)
    }
  }).catch(function (error) {
    console.error(error)
  })
}

const main = function () {
  getCPUs()
  getGPUs()
}

main()
