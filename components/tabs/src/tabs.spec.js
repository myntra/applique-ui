import React from 'react'
import { render, mount, shallow } from 'enzyme'

import Tabs from './index'

describe('tabs', () => {
  it('is a component', () => {
    expect(Tabs).toBeComponent()
  })

  it('should render the  component', () => {
    const wrapper = render(
      <Tabs>
        <Tabs.Tab className="home" title="Home">
          {'This is the home page.'}
        </Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(wrapper.find('.home').text()).toBe('Home')
  })

  it('no tab assign', () => {
    const wrapper = shallow(<Tabs></Tabs>)
    expect(wrapper.isEmptyRender()).toEqual(true)
  })

  it('secondary tabs', () => {
    const wrapper = mount(
      <Tabs type="secondary">
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(1)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
  })

  it('without passing any props to Tabs', () => {
    const wrapper = mount(
      <Tabs>
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(1)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
  })

  it('passing defaultTab props to Tabs', () => {
    const wrapper = mount(
      <Tabs defaultTab={1}>
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(0)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(true)
  })

  it('passing defaultTab props to Tabs and make that tab disable', () => {
    const wrapper = mount(
      <Tabs defaultTab={0}>
        <Tabs.Tab title="Home" disabled={true}>
          {'This is the home page.'}
        </Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
        <Tabs.Tab title="Document">{'This is the document page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(0)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(2)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(2)
        .hasClass('active')
    ).toBe(true)
  })

  it('passing activeTab props to Tabs', () => {
    const logSpy = jest.spyOn(global.console, 'error')
    render(
      <Tabs activeTab={0}>
        <Tabs.Tab title="Home" disabled={true}>
          {'This is the home page.'}
        </Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
        <Tabs.Tab title="Document">{'This is the document page.'}</Tabs.Tab>
      </Tabs>
    )

    expect(logSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '`onChange` prop is required when using `activeTab` props'
      )
    )
  })

  it('passing onChange props to Tabs', () => {
    const handleOnChange = jest.fn((index) => index)
    const wrapper = mount(
      <Tabs onChange={handleOnChange}>
        <Tabs.Tab title="Home" disabled={true}>
          {'This is the home page.'}
        </Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(1)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    expect(handleOnChange.mock.results[0].value).toBe(1)
  })

  it('passing activeTab and onChange props to Tabs', () => {
    const handleOnChange = jest.fn((index) => index)
    const wrapper = mount(
      <Tabs activeTab={1} onChange={handleOnChange}>
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(0)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(false)
    expect(handleOnChange.mock.results[0].value).toBe(0)
  })

  it('passing activeTab and defaultTab values as different in the props', () => {
    const handleOnChange = jest.fn((index) => index)
    const wrapper = mount(
      <Tabs activeTab={1} defaultTab={0} onChange={handleOnChange}>
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(
      wrapper
        .find('.tab')
        .at(1)
        .hasClass('active')
    ).toBe(true)
    wrapper
      .find('.tab')
      .at(0)
      .simulate('click')
    expect(
      wrapper
        .find('.tab')
        .at(0)
        .hasClass('active')
    ).toBe(false)
    expect(handleOnChange.mock.results[0].value).toBe(0)
  })
})
