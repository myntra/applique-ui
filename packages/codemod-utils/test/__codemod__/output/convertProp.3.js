import Foo from 'foo'

import { interopPropTransformer } from '@myntra/uikit'

const interopPropTransformerFoo$0 = interopPropTransformer(
  {},
  {
    foo: (value) => Boolean(value)
  }
)

export default function Component({ foo, ...props }) {
  return (
    <Foo {...interopPropTransformerFoo$0(props)} foo={interopPropTransformerFoo$0.coercions.foo(foo)}>
      <div>Some Text Here</div>
    </Foo>
  )
}
