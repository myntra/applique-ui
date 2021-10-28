import Foo from 'foo'

import { interopPropTransformer } from '@myntra/uikit'

const interopPropTransformerFoo$0 = interopPropTransformer(
  {
    foo: 'bar'
  },
  {}
)

export default function Component(props) {
  return (
    <Foo {...interopPropTransformerFoo$0(props)}>
      <div>Some Text Here</div>
    </Foo>
  )
}
