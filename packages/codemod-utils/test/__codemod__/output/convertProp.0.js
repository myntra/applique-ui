import Foo from 'foo'

import { interopPropTransformer } from '@myntra/uikit'

const interopPropTransformerFoo$0 = interopPropTransformer(
  {},
  {
    foo: (value) => Boolean(value)
  }
)

export default function Component({ foo }) {
  return <Foo foo={interopPropTransformerFoo$0.coercions.foo(foo)} />
}
