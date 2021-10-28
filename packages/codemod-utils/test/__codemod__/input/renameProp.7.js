import Foo from 'foo'

export default function Component(props) {
  return (
    <Foo {...props}>
      <div>Some Text Here</div>
    </Foo>
  )
}
