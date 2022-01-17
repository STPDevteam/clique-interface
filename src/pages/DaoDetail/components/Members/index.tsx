import './pc.less'

import 'react'
import { Table } from 'antd'
import { useTokenHoldersByExplorer } from 'hooks/useStpExplorerData'
import { DaoInfoProps, useCreatedDao } from 'hooks/useDAOInfo'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

const { Column } = Table

function AccountProposals({ account }: { account: string }) {
  const res = useCreatedDao(account)
  return <>{res ? res.length : '-'}</>
}

export default function Members({ daoInfo }: { daoInfo: DaoInfoProps }) {
  const { loading, data: holderList } = useTokenHoldersByExplorer(daoInfo.token?.address)

  const list = useMemo(() => {
    return (
      daoInfo.totalSupply &&
      holderList?.map(item => ({
        account: item.account,
        rank: '-',
        balance: item.balance.toSignificant(6, { groupSeparator: ',' }),
        percentage: daoInfo.totalSupply
          ? new BigNumber(item.balance.toSignificant())
              .multipliedBy(100)
              .dividedBy(daoInfo.totalSupply.toSignificant())
              .toFixed(2, 1) + '%'
          : '-',
        proposals: <AccountProposals account={item.account} />
      }))
    )
  }, [daoInfo.totalSupply, holderList])

  return (
    <section className="members">
      <h1>Members</h1>
      <p>Total holders {daoInfo.totalSupply?.toSignificant(6, { groupSeparator: ',' })}</p>
      <Table className="panel-config stp-table" loading={loading} dataSource={list} rowKey={'id'} pagination={false}>
        <Column title="Rank" dataIndex="rank" key="id" align="center" />
        <Column align="center" title="Address" dataIndex="account" key="address" />
        <Column align="center" title="Quantity" dataIndex="balance" key="quantity" />
        <Column title="Per" dataIndex="percentage" key="per" align="center" />
        <Column title="Proposals" dataIndex="proposals" key="proposals" align="center" />
      </Table>
    </section>
  )
}
