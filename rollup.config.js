/* eslint-disable node/no-unpublished-require */
const { getPackageDir, componentsDir, isTheme } = require('./scripts/utils')
const path = require('path')
const ts = require('rollup-plugin-typescript2')
const nodeResolve = require('rollup-plugin-node-resolve')
const css = require('@myntra/rollup-plugin-scss')
const url = require('rollup-plugin-url')
const del = require('rollup-plugin-delete')
const replace = require('rollup-plugin-replace')
const copy = require('rollup-plugin-copy')
const size = require('rollup-plugin-bundle-size')

if (!process.env.TARGET) {
  throw new Error(`No target found`)
}

const TARGET = process.env.TARGET
const dir = getPackageDir(TARGET)
const pkg = require(`${dir}/package.json`)

function get(file) {
  return path.resolve(dir, file)
}

const configs = (module.exports = [])

// compile component with given theme.
const config = {
  input: get('src/index.ts'),
  external(name) {
    if (isTheme(TARGET)) {
      if (
        name === '@myntra/uikit' ||
        name === '@accoutrement' ||
        name === '@design' ||
        name.startsWith('@myntra') ||
        name.startsWith('/') ||
        name.startsWith('.')
      )
        return false

      return true
    }

    return (
      (pkg.dependencies && name in pkg.dependencies) ||
      (pkg.peerDependencies && name in pkg.peerDependencies) ||
      (pkg.optionalDependencies && name in pkg.optionalDependencies)
    )
  },
  plugins: [
    del(get('dist/**/*')),
    copy({
      targets: [
        {
          src: get('src/**/*.d.ts'),
          dest: get('dist/'),
        },
      ],
    }),
    aliases(),
    sprite(),
    url({ exclude: ['**/*.sprite.svg'], include: ['**/*.png'] }),
    nodeResolve(),
    css({
      modules: {
        generateScopedName(name, filename, css) {
          const component = filename
            .replace(componentsDir + '/', '')
            .split('/')
            .shift()

          return `u-${component}-${name}`
        },
      },
    }),
    size(),
    ts({
      check: !isTheme(TARGET),
      abortOnError: !isTheme(TARGET),
      objectHashIgnoreUnknownHack: true,
      tsconfig: 'tsconfig.build.json',
      tsconfigOverride: {
        include: [get('src'), path.resolve(__dirname, '@types')],
        compilerOptions: {
          moduleResolution: 'node',
          target: 'esnext',
          module: 'esnext',
          jsx: 'react',
          lib: ['dom', 'esnext'],
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          declaration: !isTheme(TARGET),
          rootDir: get('src'),
          baseUrl: get('src'),
        },
      },
    }),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
    }),
  ],
}

if (pkg.module)
  configs.push({
    ...config,
    output: {
      file: get(pkg.module),
      format: 'esm',
    },
  })

if (pkg.main)
  configs.push({
    ...config,
    output: {
      file: get(pkg.main),
      format: 'cjs',
      exports: 'named',
    },
  })

function aliases() {
  return {
    name: 'aliases',
    resolveId(id, importer) {
      if (id === 'dayjs') {
        return require.resolve('dayjs/esm/index.js')
      }

      if (isTheme(TARGET)) {
        if (id === '@design') {
          return path.resolve(dir, 'design.scss')
        }

        if (id === '@accoutrement') {
          return path.resolve(dir, 'design.next.scss')
        }

        if (/^@myntra\/accoutrement/.test(id)) {
          return id.replace(
            '@myntra/accoutrement',
            getPackageDir('@myntra/accoutrement')
          )
        }

        if (/^@myntra\/uikit-design/.test(id)) {
          return id.replace(
            '@myntra/uikit-design',
            getPackageDir('@myntra/uikit-design')
          )
        }

        if (/^@myntra\/uikit-component-input-text\//.test(id)) {
          return id.replace(
            '@myntra/uikit-component-input-text',
            getPackageDir('@myntra/uikit-component-input-text')
          )
        }

        if (id.startsWith('@myntra/')) {
          return path.resolve(getPackageDir(id), 'src/index.ts')
        }
      }

      if (id === '@design') {
        return require.resolve('./themes/nuclei/design.scss')
      }

      if (id === '@accoutrement') {
        return require.resolve('./themes/nuclei/design.next.scss')
      }
    },
  }
}

function sprite() {
  return {
    name: 'sprite.svg',
    transform(source, id) {
      if (!/\.sprite\.svg$/i.test(id)) return

      return {
        code: `const content = ${JSON.stringify(
          source
        )}; \nconst el = document.createElement('div'); el.setAttribute('hidden', ''); el.setAttribute('style', 'display: none'); el.innerHTML = content; document.body.appendChild(el); export default null;`,
      }
    },
  }
}
