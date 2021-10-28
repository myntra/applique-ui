/* eslint-disable node/no-unpublished-require */

const fs = require('fs')
const path = require('path')

const targets = fs.readdirSync(path.resolve(__dirname, '../packages/@myntra'))

for (const target of targets) {
  console.log(`@myntra/${target}: v${require(`../packages/@myntra/${target}/package.json`).version}`)
}
