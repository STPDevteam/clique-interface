import './pc.less'

import 'react'
import { Pagination, Table } from 'antd'
// import { useTokenHoldersByExplorer } from 'hooks/useStpExplorerData'
import { DaoInfoProps, ExternalDaoInfoProps } from 'hooks/useDAOInfo'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useDaoMembers } from 'hooks/useBackedServer'
import { Box } from '@mui/material'
import { toFormatGroup } from 'utils/dao'
import { useTokenBalance } from 'state/wallet/hooks'
import { Token, TokenAmount } from 'constants/token'

const { Column } = Table

// function AccountProposals({ account }: { account: string }) {
//   const res = useCreatedDao(account)
//   return <>{res ? res.length : '-'}</>
// }

function DaoTokenBal({ account, token }: { account: string; token: Token | undefined }) {
  const bal = useTokenBalance(account, token)
  return <>{bal?.toSignificant(6, { groupSeparator: ',' }) || '-'}</>
}

function DaoTokenBalPer({
  account,
  token,
  totalSupply
}: {
  account: string
  token: Token | undefined
  totalSupply: TokenAmount | undefined
}) {
  const bal = useTokenBalance(account, token)
  return (
    <>
      {totalSupply && bal
        ? new BigNumber(bal.raw.toString())
            .multipliedBy(100)
            .dividedBy(totalSupply.raw.toString())
            .toFixed(2, 1) + '%'
        : '-'}
    </>
  )
}

export default function Members({ daoInfo }: { daoInfo: DaoInfoProps | ExternalDaoInfoProps }) {
  // const { loading, data: holderList } = useTokenHoldersByExplorer(daoInfo.token?.address)
  const { result, loading, page, holderCount } = useDaoMembers(daoInfo.token?.address)

  const list = useMemo(() => {
    return (
      daoInfo.totalSupply &&
      result.map(item => ({
        account: item.holderAddress,
        rank: '-',
        balance: <DaoTokenBal account={item.holderAddress} token={daoInfo.token} />,
        percentage: (
          <DaoTokenBalPer account={item.holderAddress} token={daoInfo.token} totalSupply={daoInfo.totalSupply} />
        ),
        proposals: item.proposalCounter
      }))
    )
  }, [daoInfo.token, daoInfo.totalSupply, result])

  return (
    <section className="members">
      <h1>Holders</h1>
      <p>Total holders {toFormatGroup(holderCount)}</p>
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
