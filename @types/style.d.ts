declare module '*.module.scss' {
  type StyleClass = string | string[] | { [key: string]: any } | undefined
  export default function classnames(...args: StyleClass[]): string
}
