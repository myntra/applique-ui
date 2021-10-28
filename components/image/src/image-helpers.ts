import IntersectionObserverPolyfill from 'intersection-observer-polyfill'

export const OBSERVER = Symbol('Image Observer')

export interface ImageContainerObserver {
  observe(
    element: HTMLElement,
    handler: (
      entry: IntersectionObserverEntry,
      observer: IntersectionObserver
    ) => void
  ): void
  unobserve(element: HTMLElement): void
  raw: IntersectionObserver
}

export function createObserver(root: Element | null): ImageContainerObserver {
  root = root || document.body

  if (root[OBSERVER]) return root[OBSERVER]

  let counter = 0
  const handlers = new WeakMap()

  const wrapper = {
    observe(
      element: HTMLElement,
      handler: (
        entry: IntersectionObserverEntry,
        observer: IntersectionObserver
      ) => void
    ) {
      handlers.set(element, handler)
      wrapper.raw.observe(element)
      counter++
    },
    unobserve(element: HTMLElement) {
      wrapper.raw.unobserve(element)
      handlers.delete(element)
      counter--

      if (counter === 0) {
        wrapper.raw.disconnect()
        delete root[OBSERVER]
      }
    },
    raw: new IntersectionObserverPolyfill(
      (entries) => {
        entries.forEach((entry) => {
          if (handlers.has(entry.target)) {
            const fn = handlers.get(entry.target)
            fn(entry, wrapper.raw)
          }
        })
      },
      {
        root: root === document.body ? null : root,
        rootMargin: '0px',
        threshold: 0,
      }
    ),
  }

  root[OBSERVER] = wrapper

  return wrapper
}
