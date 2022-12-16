import React from 'react'
import Table from '@applique-ui/table'
import PropTypes from 'prop-types'
import styles from '../styles.scss'

function ApiSection({ data = [] }) {
  return (
    <div className={styles('mdx__container-table')}>
      <Table data={data}>
        <Table.Column label="Name" key="name" />
        <Table.Column label="Type" key="type" />
        <Table.Column label="Default" key="default" />
        <Table.Column label="Description" key="description" />
      </Table>
    </div>
  )
}

ApiSection.propTypes = {
  data: PropTypes.array.isRequired,
}

export default ApiSection
