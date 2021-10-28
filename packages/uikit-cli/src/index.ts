import commander from 'commander'
import Service from './service'

export function loadCommands(
  projectDir: string,
  program: commander.CommanderStatic
) {
  const service = new Service(projectDir)

  for (const config of Object.values(service.commands)) {
    const {
      name,
      options: { description, usage = '[option]', options = {}, details },
    } = config

    const command = program.command(`${name} ${usage}`).description(description)

    if (options) {
      for (const key in options) {
        const value: any = Array.isArray(options[key])
          ? options[key]
          : [options[key]]
        command.option(key, ...value)
      }
    }

    if (details) {
      command.on('--help', () => {
        console.log('')
        console.log(details)
      })
    }

    command.action(
      createAction((...args: any[]) => {
        const cmd = args.pop()

        return service.run(name, args, cmd)
      })
    )
  }
}

function createAction(fn: (...args: any[]) => any) {
  return async (...args: any[]) => {
    try {
      await fn(...args)
    } catch (error) {
      console.error(error)
    }
  }
}
