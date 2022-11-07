const fs = require('fs')
const path = require('path')
const { getPackageDir } = require('../utils')

function main(docs, componentName) {
  const csvLocation = getPackageDir(componentName) + '/docs/csvData.csv'
  console.log(
    'writing csv data for component ',
    componentName,
    ' at location ',
    csvLocation
  )
  fs.writeFileSync(path.resolve(csvLocation), docs)
}

module.exports = main
