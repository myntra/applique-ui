import React from 'react'
import { mount } from 'enzyme'
import Measure from './measure'

describe('Measure', () => {
  it('is a component', () => {
    expect(Measure).toBeComponent()
  })

  it('should measure', (done) => {
    mount(
      <Measure
        bounds
        client
        margin
        offset
        scroll
        onMeasure={(value) => {
          expect(Object.keys(value.bounds)).toEqual([
            'top',
            'right',
            'bottom',
            'left',
            'width',
            'height',
          ])
          expect(Object.keys(value.client)).toEqual([
            'top',
            'left',
            'width',
            'height',
          ])
          expect(Object.keys(value.margin)).toEqual([
            'top',
            'right',
            'bottom',
            'left',
          ])
          expect(Object.keys(value.offset)).toEqual([
            'top',
            'left',
            'width',
            'height',
          ])
          expect(Object.keys(value.scroll)).toEqual([
            'top',
            'left',
            'width',
            'height',
          ])
          done()
        }}
      >
        <textarea className="target" />
      </Measure>
    )
  })

  it('should disconnect on unmount', () => {
    const wrapper = mount(
      <Measure onMeasure={(value) => {}}>
        <textarea className="target" />
      </Measure>
    )

    const spy = jest.spyOn(wrapper.instance()._observer, 'disconnect')

    wrapper.unmount()

    expect(spy).toHaveBeenCalled()
  })

  it('should unmount without error', () => {
    const wrapper = mount(
      <Measure onMeasure={(value) => {}}>
        <textarea className="target" />
      </Measure>
    )

    const spy = jest.spyOn(wrapper.instance()._observer, 'disconnect')
    wrapper.instance()._node = null

    wrapper.unmount()

    expect(spy).not.toHaveBeenCalled()
  })

  it('should unobserve when child changes', (done) => {
    const wrapper = mount(
      <Measure>
        <textarea className="target" />
      </Measure>
    )

    const spy = jest.spyOn(wrapper.instance()._observer, 'unobserve')

    wrapper.setProps({ children: <div /> })

    setTimeout(() => {
      expect(spy).toHaveBeenCalled()
      done()
    }, 100)
  })

  it('should render functional child', (done) => {
    const wrapper = mount(
      <Measure>
        {({ content, ref }) => (
          <textarea className="target" width={content.bounds.width} ref={ref} />
        )}
      </Measure>
    )

    setTimeout(() => {
      expect(wrapper.find('.target').html()).toEqual(
        expect.stringContaining('width')
      )
      done()
    }, 100)
  })

  it('should support programmatic usage', () => {
    const wrapper = mount(
      <Measure bounds onMeasure={(value) => {}}>
        {({ content, ref }) => (
          <textarea className="target" width={content.bounds.width} ref={ref} />
        )}
      </Measure>
    )

    const content = wrapper.instance().measure()

    expect(content).toBeTruthy()
    expect(content.bounds).toBeTruthy()

    wrapper.instance()._node = null

    expect(wrapper.instance().measure()).toBeFalsy()
  })
})
