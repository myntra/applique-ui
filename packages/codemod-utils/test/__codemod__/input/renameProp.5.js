import Foo from 'foo'

export default function Component(props) {
  return (
    <Foo foo={props.foo}>
      <div>Some Text Here</div>
    </Foo>
  )
}
