import Foo from 'foo'

export default function Component({ foo, ...props }) {
  return (
    <Foo {...props} foo={foo}>
      <div>Some Text Here</div>
    </Foo>
  )
}
