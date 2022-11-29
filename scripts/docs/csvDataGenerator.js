const fs = require('fs')
const path = require('path')

function objectToCsv(jsonData) {
  const csvRows = []
  const headers = Object.keys(jsonData[0])
  csvRows.push(headers.join(','))
  for (const row of jsonData) {
    const values = headers.map((header) => {
      const val = row[header]
      return `"${val}"`
    })

    // To add, sepearater between each value
    csvRows.push(values.join(','))
  }
  return csvRows.join('\n')
}

function main(docs, componentName) {
  const csvData = objectToCsv(docs)

  const distDir = path.resolve(__dirname, '../../dist/')
  const csvLocation = path.resolve(distDir, componentName + '.csv')

  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir)

  console.log(
    'writing csv data for component ',
    componentName,
    ' at location ',
    csvLocation
  )
  fs.writeFileSync(path.resolve(csvLocation), csvData)
}

module.exports = main
