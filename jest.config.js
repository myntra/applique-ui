const {
  targets,
  isComponent,
  isTheme,
  getShortName,
  getPackageDir,
} = require('./scripts/utils')

const aliases = {
  '\\.css$': '<rootDir>/test/unit/style.js',
  '\\.scss$': '<rootDir>/test/unit/style.js',
  '\\.png$': '<rootDir>/test/unit/image.js',
  '\\.sprite\\.svg$': '<rootDir>/test/unit/svg.js',
}

let newTargets = targets
// console.log(process.env.IGNORE.split(','))
if (process.env.IGNORE) {
  newTargets = targets.filter(
    (target) => !process.env.IGNORE.split(',').includes(target)
  )
}

newTargets.forEach((target) => {
  const pkg = require(`${getPackageDir(target)}/package.json`)
  aliases[`${target}$`] = `<rootDir>/${
    isComponent(target) ? 'components' : isTheme(target) ? 'themes' : 'packages'
  }/${getShortName(target)}/${/src/.test(pkg.main) ? pkg.main : 'src/index.ts'}`
})

module.exports = {
  moduleNameMapper: aliases,
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup-jest.js'],
  setupFiles: [
    '<rootDir>/test/unit/setup-enzyme.js',
    '<rootDir>/test/unit/setup-window.js',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/old-packages/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es))/'],
  collectCoverageFrom: [
    'components/*/src/**/*.{ts,tsx}',
    'packages/*/src/**/*.{ts,tsx}',
    '!components/group/src/**/*.{ts,tsx}',
    '!components/flex/src/**/*.{ts,tsx}',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageDirectory: 'coverage',
  coverageThreshold: process.env.CI
    ? {
        global: {
          branches: 50,
          functions: 80,
          lines: 50,
          statements: -20,
        },
      }
    : {},
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      packageJson: '<rootDir>/package.json',
    },
  },
}
