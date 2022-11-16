module.exports = function loader(source) {
  return `import Code, { Documenter, CodePreview } from '@code'\nimport ImagePreview from '@imagePreview'\n${source}`
}
