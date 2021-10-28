import Foo from 'foo'

export default function Component(props) {
  return (
    <Foo bar={props.foo}>
      <div>Some Text Here</div>
    </Foo>
  )
}
