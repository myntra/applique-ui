export default function TestComponent(props) {
  return (
    <Foo {...props}>
      <Foo noProps />
    </Foo>
  )
}
