const { readdirSync } = require('fs')
const replace = require('replace-in-file')

const directories = ['./components', './packages', './themes']
const [packageName, type, component] = process.argv.slice(2)
// console.log({ packageName, type, component }, component === 'component')

const getFileList = (dirName) => {
  let files = []
  const items = readdirSync(dirName, { withFileTypes: true })

  for (const item of items) {
    if (['node_modules', 'dist'].includes(item.name)) continue

    if (item.isDirectory()) {
      files = [...files, ...getFileList(`${dirName}/${item.name}`)]
    } else {
      files.push(`${dirName}/${item.name}`)
    }
  }

  return files
}

const rename = (files) => {
  const options = {
    files: files,
    from:
      component === 'component'
        ? `@mapplique/uikit-component-${packageName}`
        : component === 'theme'
        ? `@mapplique/uikit-theme-${packageName}`
        : `@mapplique/${packageName}`,
    to:
      component === 'theme'
        ? `@applique-ui/theme-${packageName}`
        : `@applique-ui/${packageName}`,
  }
  try {
    const results = replace.sync(options)
    console.log(
      'Replacement results:',
      results
        .filter((res) => res.hasChanged)
        .map((res) => res.file)
        .join('\n')
    )
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

// rename in self package.json
if (type === 'packageOnly') {
  rename(`${component}s/${packageName}/package.json`)
} else if (type === 'allFiles') {
  const files = []
  directories.forEach((dir) => {
    files.push(...getFileList(dir))
  })

  // rename all occurences
  rename(files)
}
