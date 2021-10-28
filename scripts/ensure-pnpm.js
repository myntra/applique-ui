if (process.env.npm_execpath.indexOf('pnpm') === -1) {
  console.log('You must use pnpm to install, not NPM or Yarn.\n')
  process.exit(1) // eslint-disable-line no-process-exit
}
