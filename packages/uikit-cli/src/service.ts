import chalk from 'chalk'

export interface Command<T = any> {
  name: string
  mode?: 'production' | 'development'
  options: {
    description: string
    usage?: string
    details?: string
    options?: Record<string, string | [string, string | number | boolean]>
  }
  handler(
    options: T,
    ...args: string[] | [string[]]
  ): Promise<void | any> | void | any
}

export class Service {
  public commands: Record<
    string,
    Command & { plugin: string; [key: string]: string }
  > = {}
  public plugins: {
    id: string
    apply: (api: Service /*, options: Spectrum.Project.Options*/) => void
  }[]

  constructor(public context: string, public mode: string = 'developmemnt') {
    console.log(chalk.green('Running from: ' + __filename))
    this.plugins = this.resolveCommands()
    this.init()
  }

  private init() {
    this.plugins.forEach(({ id, apply }) => {
      apply(this /*, this.options*/)
    })
  }

  private resolveCommands() {
    const requireCommand = (id: string) => {
      const command = require(id)

      if (typeof command.default === 'function') {
        return command.default
      }

      return command
    }

    const idToCommand = (id: string) => ({
      id: id.replace(/^.\//, 'build-in:'),
      apply: requireCommand(id),
    })

    const plugins = [
      './commands/codemods',
      './commands/lint',
      './commands/migrate',
    ].map(idToCommand)

    return plugins
  }

  registerCommand<T>({ name, mode, options, handler }: Command<T>) {
    if (name in this.commands) {
      const command = this.commands[name]

      console.warn(
        `Command '${name}' registered by '${command.plugin}' plugin would be overridden by '${name}' plugin`
      )
    }

    this.commands[name] = {
      name,
      mode,
      plugin: name,
      options: options || { description: '' },
      handler,
    } as any
  }

  async run(name: string, args: string[] = [], options: any = {}) {
    console.log(`run ${chalk.bold(name)}`)
    const command = this.commands[name]
    const mode = options.mode || command.mode || 'development'

    if (mode) {
      process.env.NODE_ENV = this.mode = mode
    }

    return command.handler(options, ...args)
  }
}

export default Service
