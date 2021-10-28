type Key = string | number

type ReactText = string | number
type ReactChild = ReactElement | ReactText
interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray
interface ReactPortal extends ReactElement {
  key: Key | null
  children: ReactNode
}
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined

interface ErrorInfo {
  /**
   * Captures which component contained the exception, and its ancestors.
   */
  componentStack: string
}

interface NewLifecycle<P, S, SS> {
  /**
   * Runs before React applies the result of `render` to the document, and
   * returns an object to be given to componentDidUpdate. Useful for saving
   * things such as scroll position before `render` causes changes to it.
   *
   * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
   * lifecycle events from running.
   */
  getSnapshotBeforeUpdate?(
    prevProps: Readonly<P>,
    prevState: Readonly<S>
  ): SS | null
  /**
   * Called immediately after updating occurs. Not called for the initial render.
   *
   * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
   */
  componentDidUpdate?(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot?: SS
  ): void
}

interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS> {
  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount?(): void
  /**
   * Called to determine whether the change in props and state should trigger a re-render.
   *
   * `Component` always returns true.
   * `PureComponent` implements a shallow comparison on props and state and returns true if any
   * props or states have changed.
   *
   * If false is returned, `Component#render`, `componentWillUpdate`
   * and `componentDidUpdate` will not be called.
   */
  shouldComponentUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): boolean
  /**
   * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
   * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
   */
  componentWillUnmount?(): void
  /**
   * Catches exceptions generated in descendant components. Unhandled exceptions will cause
   * the entire component tree to unmount.
   */
  componentDidCatch?(error: Error, errorInfo: ErrorInfo): void
}

interface Component<P = {}, S = {}, SS = any>
  extends ComponentLifecycle<P, S, SS> {}

type JSXElementConstructor<P> =
  | ((props: P) => ReactElement | null)
  | (new (props: P) => Component<P, any>)

interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>
> {
  type: T
  props: P
  key: Key | null
}
interface ProviderProps<T> {
  value: T
  children?: ReactNode
}

interface ConsumerProps<T> {
  children: (value: T) => ReactNode
  unstable_observedBits?: number
}

interface ExoticComponent<P = {}> {
  /**
   * **NOTE**: Exotic components are not callable.
   */
  (props: P): ReactElement | null
  readonly $$typeof: symbol
}

interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
  displayName?: string
}

interface ProviderExoticComponent<P> extends ExoticComponent<P> {}

type ContextType<C extends Context<any>> = C extends Context<infer T>
  ? T
  : never
type Provider<T> = ProviderExoticComponent<ProviderProps<T>>
type Consumer<T> = ExoticComponent<ConsumerProps<T>>
interface Context<T> {
  Provider: Provider<T>
  Consumer: Consumer<T>
  displayName?: string
}
type SetStateAction<S> = S | ((prevState: S) => S)
type Dispatch<A> = (value: A) => void
type Reducer<S, A> = (prevState: S, action: A) => S
type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any>
  ? S
  : never
type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
  any,
  infer A
>
  ? A
  : never
type DependencyList = ReadonlyArray<any>
type EffectCallback = () => void | (() => void | undefined)

interface MutableRefObject<T> {
  current: T
}

/**
 * Accepts a context object (the value returned from `React.createContext`) and returns the current
 * context value, as given by the nearest context provider for the given context.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usecontext
 */
declare function useContext<T>(
  context: Context<T> /*, (not public API) observedBits?: number|boolean */
): T
/**
 * Returns a stateful value, and a function to update it.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */
declare function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>]
/**
 * Returns a stateful value, and a function to update it.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */
declare function useState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
]
/**
 * An alternative to `useState`.
 *
 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
 * multiple sub-values. It also lets you optimize performance for components that trigger deep
 * updates because you can pass `dispatch` down instead of callbacks.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
declare function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & ReducerState<R>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>]
/**
 * An alternative to `useState`.
 *
 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
 * multiple sub-values. It also lets you optimize performance for components that trigger deep
 * updates because you can pass `dispatch` down instead of callbacks.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
declare function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>]
/**
 * An alternative to `useState`.
 *
 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
 * multiple sub-values. It also lets you optimize performance for components that trigger deep
 * updates because you can pass `dispatch` down instead of callbacks.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */

declare function useReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined
): [ReducerState<R>, Dispatch<ReducerAction<R>>]
/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
declare function useRef<T>(initialValue: T): MutableRefObject<T>

/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
 * of the generic argument.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
interface RefObject<T> {
  readonly current: T | null
}
declare function useRef<T>(initialValue: T | null): RefObject<T>
/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
declare function useRef<T = undefined>(): MutableRefObject<T | undefined>
/**
 * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
 * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
 *
 * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
 *
 * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
 * `componentDidMount` and `componentDidUpdate`.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
declare function useLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void
/**
 * Accepts a function that contains imperative, possibly effectful code.
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 */
declare function useEffect(effect: EffectCallback, deps?: DependencyList): void

type Ref<T> =
  | { bivarianceHack(instance: T | null): void }['bivarianceHack']
  | RefObject<T>
  | null
/**
 * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
 * `ref`. As always, imperative code using refs should be avoided in most cases.
 *
 * `useImperativeHandle` should be used with `React.forwardRef`.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
 */
declare function useImperativeHandle<T, R extends T>(
  ref: Ref<T> | undefined,
  init: () => R,
  deps?: DependencyList
): void
/**
 * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
 * has changed.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usecallback
 */
declare function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T
/**
 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
 *
 * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
 * the second argument.
 *
 * ```ts
 * function expensive () { ... }
 *
 * function Component () {
 *   const expensiveResult = useMemo(expensive, [expensive])
 *   return ...
 * }
 * ```
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usememo
 */
declare function useMemo<T>(
  factory: () => T,
  deps: DependencyList | undefined
): T
/**
 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
 *
 * NOTE: We don’t recommend adding debug values to every custom hook.
 * It’s most valuable for custom hooks that are part of shared libraries.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
 */
declare function useDebugValue<T>(value: T, format?: (value: T) => any): void
