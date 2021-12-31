import './pc.less'

import 'react'
import { Table } from 'antd'

const { Column } = Table

const Members = () => {
  // Mock
  const config = ' '
    .repeat(4)
    .split(' ')
    .map((item, index) => ({
      id: index + 1,
      address: '0xd97da63d086d222ede0aa8ee8432031465eef',
      quantity: 1000000,
      per: '30%',
      proposals: 100
    }))

  return (
    <section className="members">
      <h1>Members</h1>
      <p>Total holders 1,000</p>
      <Table className="panel-config stp-table" dataSource={config} rowKey={'id'} pagination={false}>
        <Column title="Rank" dataIndex="id" key="id" align="center" />
        <Column align="center" title="Address" dataIndex="address" key="address" />
        <Column align="center" title="Quantity" dataIndex="quantity" key="quantity" />
        <Column title="Per" dataIndex="per" key="per" align="center" />
        <Column title="Proposals" dataIndex="proposals" key="proposals" align="center" />
      </Table>
    </section>
  )
}

export default Members
