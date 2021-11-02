module.exports = function loader(source) {
  return `import Documenter from '@documenter'\nimport Code from '@code'\n${source}`
}
