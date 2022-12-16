const promised = require('@znck/promised')
const glob = require('glob')
const path = require('path')

async function findTransformFiles() {
  const paths = [
    path.resolve(
      process.cwd(),
      `node_modules/@mapplique/codemod-utils/codemods/unity-uikit/`
    ),
    path.resolve(
      process.cwd(),
      `node_modules/@mapplique/codemod-utils/codemods/uikit/`
    ),
  ]

  return Array.from(
    new Set(
      (
        await Promise.all(
          paths.map((dir) =>
            promised({
              glob,
            }).glob('**/*.codemod.js', {
              cwd: dir,
              nodir: true,
              realpath: true,
            })
          )
        )
      ).reduce((acc, item) => acc.concat(item), [])
    )
  ).filter((it) => !/\/tests?\//i.test(it))
}

async function findTransforms(params) {
  const files = await findTransformFiles()
  console.log(files)
  return files.reduce((acc, file) => {
    const name = path.basename(file).replace('.codemod.js', '')
    acc[name] = {
      ...acc[name],
      ...require(file),
      __filename: file,
    }

    return acc
  }, Object.create(null))
}

module.exports = {
  findTransforms,
  findTransformFiles,
}
