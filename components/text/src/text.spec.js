import Text from './text'

describe('text', () => {
  it('is a component', () => {
    expect(Text).toBeComponent()
  })

  describe('text subcomponents', () => {
    it('h1 is a component', () => {
      expect(Text.h1).toBeComponent()
    })
    it('h2 is a component', () => {
      expect(Text.h2).toBeComponent()
    })
    it('h3 is a component', () => {
      expect(Text.h3).toBeComponent()
    })
    it('h4 is a component', () => {
      expect(Text.h4).toBeComponent()
    })
  })
})
