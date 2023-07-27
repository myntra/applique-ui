import React from 'react'
import { shallow, mount } from 'enzyme'

import Table from './index'
import SimpleTable from './renderers/simple'
import VirtualTable from './renderers/virtual'
import TableFilterDropdown from './enhancers/table-filter/table-filter-dropdown'
import TableSortDropdown from './enhancers/table-sort/table-sort-dropdown'

describe('table', () => {
  it('is a component', () => {
    expect(Table).toBeComponent()
  })
  it('should render SimpleTable component', () => {
    const data = [
      { id: 1, name: 'Jane Doe', age: 24, status: 'single', visits: 80 },
      { id: 2, name: 'John Doe', age: 26, status: 'single', visits: 120 },
    ]
    const wrapper = shallow(
      <Table data={data}>
        <Table.Column label="ID" key="id" />
        <Table.Column label="Name" key="name" />
        <Table.Column label="Info" key="info">
          <Table.Column label="Age" key="age">
            {({ data }) => <span>{data.age} years</span>}
          </Table.Column>
          <Table.Column label="Status" key="status" />
        </Table.Column>
        <Table.Column
          label="Visits"
          key="visits"
          accessor={({ visits }) => visits + ' of 200'}
        />
        <Table.Row>
          {({ children, style }) => (
            <Table.TR style={style}>{children}</Table.TR>
          )}
        </Table.Row>
      </Table>
    )
    expect(wrapper.find(SimpleTable)).toHaveLength(1)
  })
  it('should render a virtualised table', () => {
    const data = Array(1000)
      .fill(0)
      .map((_, id) => ({ id: id + 1, firstName: 'Jane', lastName: 'Doe' }))
    const wrapper = mount(
      <div style={{ height: 300, minWidth: 600 }}>
        <Table virtualized data={data} scrollMode="window">
          {/* Table Configuration */}
          <Table.Column key="id" label="ID" fixed>
            {({ data }) => <div>{data.id}</div>}
          </Table.Column>
          <Table.Column key="name" label="Name" fixed>
            <Table.Column key="firstName" label="First Name" minWidth={120}>
              {({ data }) => <div>{data.firstName}</div>}
            </Table.Column>
            <Table.Column key="lastName" label="Last Name" minWidth={120}>
              {({ data }) => <div>{data.lastName}</div>}
            </Table.Column>
          </Table.Column>

          {Array(20)
            .fill(0)
            .map((_, group) => (
              <Table.Column
                key={'group' + group}
                label={`Group (${group + 1})`}
                minWidth={100}
              >
                {Array(50)
                  .fill(0)
                  .map((_, index) => (
                    <Table.Column
                      key={`group-${group}-column-${index}`}
                      label={`Column ${index + 1}`}
                      minWidth={120}
                    >
                      {({ data }) => <div>Sunil</div>}
                    </Table.Column>
                  ))}
              </Table.Column>
            ))}

          {/* Table Customization */}
          <Table.Row selector={(index) => index % 2}>
            {({ children, style, rowId }) => (
              <Table.TR key={rowId} style={{ ...style, color: 'red' }}>
                {children}
              </Table.TR>
            )}
          </Table.Row>
        </Table>
      </div>
    )
    // console.log(wrapper.debug());
    expect(wrapper.find(VirtualTable)).toHaveLength(1)
  })
  it('should render simple table with row sorting', () => {
    const data = [
      { id: 1, name: 'Jane Doe', age: 24, status: 'single', visits: 80 },
      { id: 2, name: 'John Doe', age: 26, status: 'single', visits: 120 },
    ]
    const wrapper = mount(
      <Table data={data}>
        <Table.Column label="ID" key="id" sortable />
        <Table.Column label="Name" key="name" />
        <Table.Column label="Age" key="age">
          {({ data }) => <span>{data.age} years</span>}
        </Table.Column>
        <Table.Column label="Status" key="status" />
        <Table.Column
          label="Visits"
          key="visits"
          accessor={({ visits }) => visits + ' of 200'}
        />
      </Table>
    )
    expect(wrapper.find(TableSortDropdown).state('sortOrder')).toBe(null)
    wrapper
      .find('.sort-trigger')
      .at(0)
      .simulate('click')
    expect(wrapper.find(TableSortDropdown).state('sortOrder')).toBe('desc')
    wrapper
      .find('.sort-trigger')
      .at(0)
      .simulate('click')
    expect(wrapper.find(TableSortDropdown).state('sortOrder')).toBe('asc')
    wrapper
      .find('.sort-trigger')
      .at(0)
      .simulate('click')
    expect(wrapper.find(TableSortDropdown).state('sortOrder')).toBe(null)
  })
  it('should render simple table with row filters', () => {
    const data = [
      { id: 1, name: 'Jane Doe', age: 24, status: 'single', visits: 80 },
      { id: 2, name: 'John Doe', age: 26, status: 'single', visits: 120 },
    ]
    const wrapper = mount(
      <Table data={data}>
        <Table.Filter>
          <Table.Column label="ID" key="id" sortable />
        </Table.Filter>
        <Table.Column label="Name" key="name" />
        <Table.Column label="Age" key="age">
          {({ data }) => <span>{data.age} years</span>}
        </Table.Column>
        <Table.Column label="Status" key="status" />
        <Table.Column
          label="Visits"
          key="visits"
          accessor={({ visits }) => visits + ' of 200'}
        />
      </Table>
    )

    expect(wrapper.find(TableFilterDropdown)).toHaveLength(1)
    wrapper
      .find('.filter-trigger')
      .at(0)
      .simulate('click')
    expect(wrapper.find(TableFilterDropdown).state('isOpen')).toBe(true)
    wrapper
      .find('.filter-container')
      .childAt(0)
      .childAt(0)
      .simulate('click')
    wrapper
      .find('.footer')
      .childAt(0)
      .simulate('click')
    expect(wrapper.find(TableFilterDropdown).props().value).toMatchObject({
      id: [1, 2],
    })

    wrapper
      .find('.filter-trigger')
      .at(0)
      .simulate('click')
    wrapper
      .find('.filter-container')
      .childAt(0)
      .childAt(1)
      .simulate('click')
    wrapper
      .find('.footer')
      .childAt(0)
      .simulate('click')
    expect(wrapper.find(TableFilterDropdown).props().value).toMatchObject({
      id: [],
    })
  })
})
