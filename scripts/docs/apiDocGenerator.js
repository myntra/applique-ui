const fs = require('fs')
const path = require('path')
const { getPackageDir, pascalCase } = require('../utils')

function boilerplateCode(componentName) {
  const code = `
import data from './data.js'

## ${pascalCase(componentName)}

<Api data={data['${pascalCase(componentName)}'].data} />
    `

  return code
}

function jsonCode(data) {
  return `
const json = ${JSON.stringify(data)}
export default json
            `
}

function writeAPIDocFile(data, componentName) {
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

  if (!fs.existsSync(path.resolve(mdxLocation)))
    fs.writeFileSync(path.resolve(mdxLocation), boilerplateCode(componentName))

  fs.writeFileSync(path.resolve(jsonLocation), jsonCode(data))
}

function main(docs) {
  for (const component in docs) {
    if (Object.hasOwnProperty.call(docs, component)) {
      const doc = docs[component]
      writeAPIDocFile(doc, component)
    }
  }
}

module.exports = main
