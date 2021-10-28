/* eslint-disable node/no-unpublished-require */
const React = require('react')
const { shallow } = require('enzyme')

function isFunction(v) {
  return typeof v === 'function'
}

function isClass(v) {
  return isFunction(v) && /^\s*class\s+/.test(v.toString())
}

/**
 * @typedef {import("enzyme").CommonWrapper} Wrapper
 */

const matchers = {
  toBeComponent(received) {
    const pass = isClass(received) ? isFunction(received.prototype.render) : isFunction(received)

    if (pass) {
      return {
        message: () => `expected ${this.utils.printReceived(received)} to be a react component`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${this.utils.printReceived(received)} not to be a react component`,
        pass: false
      }
    }
  },
  /**
   * @param {Wrapper} wrapper
   * @param {string|Function} tag
   */
  toBeTag(wrapper, tag) {
    const pass = wrapper.is(tag)

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(wrapper.getElement().type)} not to be ${this.utils.printExpected(tag)}`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(wrapper.getElement().type)} to be ${this.utils.printExpected(tag)}`,
        pass: false
      }
    }
  },

  /**
   * @this {typeof jest}
   * @param {{(): void}} received
   * @param {'error' | 'log' | 'warn'} type
   * @param {*} matcher
   */
  toConsole(received, type, matcher) {
    const CONSOLE_ARGS = []
    const spy = jest.spyOn(console, type).mockImplementation((...args) => {
      CONSOLE_ARGS.push(args)
    })

    try {
      received()

      if (this.isNot) {
        expect(spy).not.toHaveBeenCalled()
      } else {
        expect(spy).toHaveBeenCalled()
      }

      const pass = CONSOLE_ARGS.some(args => {
        if (Array.isArray(matcher)) {
          return this.equals(args, matcher)
        } else {
          return this.equals(args.join('\n'), matcher)
        }
      })

      if (pass) {
        return {
          message: () =>
            `expected not to console ${type} ${this.utils.printExpected(
              matcher
            )}\n Received: ${this.utils.printExpected(CONSOLE_ARGS)}`,
          pass: true
        }
      } else {
        return {
          message: () =>
            `expected to console ${type} ${this.utils.printExpected(matcher)}\n Received: ${this.utils.printExpected(
              CONSOLE_ARGS
            )}`,
          pass: false
        }
      }
    } finally {
      spy.mockRestore()
    }
  },

  toConsoleError(received, matcher) {
    return matchers.toConsole.call(this, received, 'error', matcher)
  },

  toConsoleWarn(received, matcher) {
    return matchers.toConsole.call(this, received, 'warn', matcher)
  },

  toBeTransparentComponent(Received, props = {}) {
    let pass, html

    try {
      const wrapper = shallow(React.createElement(Received, { ...props, 'data-transparent-check': true }))

      html = wrapper.html()
      pass = wrapper.find('[data-transparent-check]').length > 0
    } catch (e) {
      pass = false
      console.error(e)
    }

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            Received
          )} not to be a transparent component\nReceived: \n${this.utils.printReceived(html)}`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            Received
          )} to be a transparent component\nReceived: \n${this.utils.printReceived(html)}`,
        pass: false
      }
    }
  },

  toHaveText(received, expected) {
    const pass = received.length && typeof received.text() === 'string' && received.text().includes(expected)

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(expected)} to be ${this.utils.printReceived(received.html())}`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(expected)} nod to be ${this.utils.printReceived(received.html())}`,
        pass: false
      }
    }
  }
}

global.expect.extend(matchers)
