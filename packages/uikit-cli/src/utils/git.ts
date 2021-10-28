import exec from 'execa'

function git(cwd = process.cwd()) {
  async function isDirty() {
    const {
      stdout,
    } = await exec.command(
      'git diff-index --quiet HEAD -- && echo clean || echo dirty',
      { cwd, shell: true }
    )

    return stdout !== 'clean'
  }

  async function isClean() {
    return !(await isDirty())
  }

  async function reset(to) {
    await exec.command(`git reset ${to}`, { cwd, shell: true })
  }

  async function stage(...files) {
    await exec.command(`git add ${files.join(' ')}`, { cwd, shell: true })
  }

  async function commit(message, files = [], author?: string) {
    if (files.length) await stage(...files)
    if (author)
      author =
        typeof author === 'string' ? '--author ' + JSON.stringify(author) : ''
    if (await isDirty())
      await exec.command(`git commit -m ${JSON.stringify(message)}`, {
        cwd,
        shell: true,
      })
  }

  async function log(count = 1) {
    return (
      await exec.command(`git log -${count} --color`, { cwd, shell: true })
    ).stdout
  }

  return { isDirty, isClean, stage, commit, log, reset }
}

export default git
