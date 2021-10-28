module.exports = {
  hooks: {
    readPackage(pkg, context) {
      context.log(pkg.name)

      if (pkg.name === 'react-docgen-typescript') {
        pkg.dependencies = pkg.devDependencies

      }

      return pkg
    }
  }
}
