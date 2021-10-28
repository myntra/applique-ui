/* eslint-disable node/no-unpublished-require */
// create package.json, README, etc. for packages that don't have them yet

const fs = require('fs')
const path = require('path')

const { version } = require('../package.json')
const {
  components: targets,
  getPackageDir,
  getPackageRepository,
  getShortName,
  isComponent,
  pascalCase,
  initSrc,
} = require('./utils')

targets.forEach((name) => {
  const shortName = getShortName(name)
  const rootDir = getPackageDir(name)
  console.log(`Bootstrapping module: ${name}`)
  const pkgFile = path.join(rootDir, `package.json`)
  const pkg = {
    name: `@myntra/uikit-component-${name}`,
    version,
    main: `dist/${shortName}.cjs.js`,
    module: `dist/${shortName}.esm.js`,
    types: 'dist/index.d.ts',
    author: 'Sunil Jhamnani<sunil.jhamnani@myntra.com>',
    license: 'UNLICENSED',
    repository: getPackageRepository(name),
    publishConfig: {
      registry: 'https://registry.myntra.com',
    },
    keywords: ['uikit', 'component'],
    homepage: 'https://uikit.myntra.com/components/' + shortName,
    files: ['src/', 'dist/', 'bin/'],
    sideEffects: false,
  }

  const srcFiles = initSrc(shortName)

  if (isComponent(name)) {
    pkg.optionalDependencies = {
      react: '>=15.4',
    }
    pkg.devDependencies = {
      '@types/react': 'latest',
    }
    pkg.peerDependencies = {}
    pkg.dependencies = {
      '@myntra/uikit-can-i-use': '1.13.*',
      '@myntra/uikit-utils': '1.13.*',
      'prop-types': '^15.7.2',
      'uikit-icons': 'npm:@myntra/uikit-icons@^1.0.9',
    }
  }

  if (fs.existsSync(pkgFile)) {
    Object.assign(pkg, require(pkgFile))
  }

  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')

  console.log(`Package file created at ${pkgFile}`)
  if (isComponent(name)) {
    const readmeFile = path.join(rootDir, `readme.mdx`)

    if (!fs.existsSync(readmeFile)) {
      const component = pascalCase(shortName)
      fs.writeFileSync(
        readmeFile,
        `
import ${component} from './src/${shortName}'

# ${component}

<Documenter component={${component}}>

\`\`\`jsx preview
// TODO: Add example.
\`\`\`

</Documenter>
`.trimLeft()
      )
    }
  } else {
    const readmeFile = path.join(rootDir, `README.md`)
    if (!fs.existsSync(readmeFile)) {
      fs.writeFileSync(readmeFile, `# ${name}`)
    }
  }

  const mainFile = path.join(rootDir, pkg.main)
  console.log('mainFile: ', mainFile, '\n')
  const srcDir = path.dirname(mainFile)
  console.log('srcDir: ', srcDir, '\n')
  if (!fs.existsSync(mainFile)) {
    if (!fs.existsSync(srcDir)) {
      const newDir = path.join(rootDir, 'src')
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir)
        srcFiles.forEach((fileObj) =>
          fs.writeFileSync(
            path.join(newDir, fileObj.name),
            fileObj.initialContent
          )
        )
      }
    }
  }
  console.log(`Project files created at: ${srcDir}`)
})
