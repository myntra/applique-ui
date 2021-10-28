import Foo from 'foo'

export default function Component({ foo }) {
  return (
    <Foo bar={foo}>
      <div>Some Text Here</div>
    </Foo>
  )
}
