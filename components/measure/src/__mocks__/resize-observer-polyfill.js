export default function MockResizeObserverPolyfill(fn) {
  return {
    observe: (target) => {
      fn([{ target }])
    },
    disconnect: () => {},
    unobserve() {},
  }
}
