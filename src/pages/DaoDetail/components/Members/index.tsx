import './pc.less'

import 'react'
import { Pagination, Table } from 'antd'
// import { useTokenHoldersByExplorer } from 'hooks/useStpExplorerData'
import { DaoInfoProps, ExternalDaoInfoProps, useCreatedDao } from 'hooks/useDAOInfo'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useDaoMembers } from 'hooks/useBackedServer'
import { TokenAmount } from 'constants/token'
import { Box } from '@mui/material'
import { toFormatGroup } from 'utils/dao'

const { Column } = Table

function AccountProposals({ account }: { account: string }) {
  const res = useCreatedDao(account)
  return <>{res ? res.length : '-'}</>
}

export default function Members({ daoInfo }: { daoInfo: DaoInfoProps | ExternalDaoInfoProps }) {
  // const { loading, data: holderList } = useTokenHoldersByExplorer(daoInfo.token?.address)
  const { result, loading, page } = useDaoMembers(daoInfo.token?.address)

  const list = useMemo(() => {
    return (
      daoInfo.totalSupply &&
      result.map(item => ({
        account: item.holderAddress,
        rank: '-',
        balance: daoInfo.token
          ? new TokenAmount(daoInfo.token, item.balance).toSignificant(6, { groupSeparator: ',' })
          : '-',
        percentage: daoInfo.totalSupply
          ? new BigNumber(item.balance)
              .multipliedBy(100)
              .dividedBy(daoInfo.totalSupply.raw.toString())
              .toFixed(2, 1) + '%'
          : '-',
        proposals: <AccountProposals account={item.holderAddress} />
      }))
    )
  }, [daoInfo.token, daoInfo.totalSupply, result])

  return (
    <section className="members">
      <h1>Holders</h1>
      <p>Total holders {toFormatGroup(page.total)}</p>
      <Table className="panel-config stp-table" loading={loading} dataSource={list} rowKey={'id'} pagination={false}>
        <Column title="Rank" dataIndex="rank" key="id" align="center" />
        <Column align="center" title="Address" dataIndex="account" key="address" />
        <Column align="center" title="Quantity" dataIndex="balance" key="quantity" />
        <Column title="%" dataIndex="percentage" key="per" align="center" />
        <Column title="Proposals" dataIndex="proposals" key="proposals" align="center" />
      </Table>
      <Box display={'flex'} justifyContent={'center'}>
        <Pagination
          simple
          size="default"
          hideOnSinglePage
          pageSize={page.pageSize}
          style={{ marginTop: 20 }}
          current={page.currentPage}
          total={page.total}
          onChange={e => page.setCurrentPage(e)}
        />
      </Box>
    </section>
  )
}
