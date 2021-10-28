const chalk = require('chalk')

export const wrapCommand = (fn) => {
  return (...args) => {
    return fn(...args)
      .then(() => {
        console.log(chalk.green('ok.'))
      })
      .catch((err) => {
        console.log(chalk.red('error.'))
        console.error(chalk.red(err.stack))
      })
  }
}
