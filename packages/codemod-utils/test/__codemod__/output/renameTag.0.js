export default function TestComponent(props) {
  return (
    <Bar {...props}>
      <Bar noProps />
    </Bar>
  )
}
