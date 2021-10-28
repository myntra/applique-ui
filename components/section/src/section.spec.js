import React from 'react'
import { mount } from 'enzyme'

import Section from './index'
import Button from '@myntra/uikit-component-button'

describe('section', () => {
  it('is a component', () => {
    expect(Section).toBeComponent()
  })
  it('should render the component', () => {
    const wrapper = mount(
      <Section title="Gotta catch 'em all">
        <Button type="link">Badges</Button>
        <Button type="secondary">Pokeballs</Button>
        <Button>Pokedex</Button>

        <p>
          I will travel across the land,
          <br />
          Searching far and wide.
          <br />
          Each Pokemon to understand
          <br />
          Pokemon!
        </p>
      </Section>
    )
    expect(wrapper.find('section.container')).toHaveLength(1)
    expect(wrapper.find('div.content')).toHaveLength(1)
  })
})
