const fs = require('fs')
const path = require('path')
const { getPackageDir } = require('../utils')

function processDocJSON(componentDoc) {
  return {
    name: componentDoc.name,
    data: componentDoc.doc.props.map(function(prop) {
      return {
        name: prop.name,
        default:
          prop.defaultValue != null
            ? prop.defaultValue.value
            : prop.defaultValue,
        description: prop.description,
        type: prop.type.name,
      }
    }),
  }
}

function boilerplateCode() {
  const code = `
import data from './data.js'

<Table data={data}>
    <Table.Column label="Name" key="name"/>
    <Table.Column label="Type" key="type"/>
    <Table.Column label="Default" key="default"/>
    <Table.Column label="Description" key="description"/>
</Table>
    `

  return code
}

function jsonCode(data) {
  return `
const json = ${JSON.stringify(data)}
export default json
            `
}

function writeAPIDocFile(doc) {
  const componentName = doc.name
  const data = doc.data
  const mdxLocation = getPackageDir(componentName) + '/docs/Api.mdx'
  const jsonLocation = getPackageDir(componentName) + '/docs/data.js'
  console.log(
    'writing api for component ',
    componentName,
    ' at location ',
    mdxLocation
  )

  const docDir = getPackageDir(componentName) + '/docs'

  if (!fs.existsSync(docDir)) fs.mkdirSync(docDir)

  fs.writeFileSync(path.resolve(mdxLocation), boilerplateCode())
  fs.writeFileSync(path.resolve(jsonLocation), jsonCode(data))
}

function main(docs) {
  const processedDoc = docs.map(processDocJSON)

  processedDoc.forEach(writeAPIDocFile)
}

module.exports = main
