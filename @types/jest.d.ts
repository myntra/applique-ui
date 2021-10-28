declare module 'jest' {
  namespace jest {
    interface Matchers<R> {
      /**
       * Used to check that value is a component.
       */
      toBeComponent(): R
      /**
       * Used to check that the component forwards unhandled props to some node.
       */
      toBeTransparentComponent(requiredProps?: Record<string, any>): R
      /**
       * Used to check that wrapper renders expected tag.
       */
      toBeTag(tag: string | Function): R
      /**
       * Used to check that expected logs are seen.
       */
      toConsole(type: 'error' | 'log' | 'warn', expected: any): R
      /**
       * Used to check that expected error logs are seen.
       */
      toConsoleError(expected: any): R
      /**
       * Used to check that expected error logs are seen.
       */
      toConsoleWarn(expected: any): R
      /**
       * Used to check that wrapper has text.
       */
      toHaveText(expected: any): R
    }
  }
}
