import Modal from 'components/Modal'
import { Box, Link, Typography } from '@mui/material'
import { Pagination, Table } from 'antd'
import Column from 'antd/lib/table/Column'
import { useProposalVoteList } from 'hooks/useBackedServer'
import { Token, TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import { getEtherscanLink, shortenAddress } from 'utils'
import { shortenHashAddress } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'

export default function VoteList({
  id,
  votingAddress,
  list,
  token
}: {
  votingAddress: string
  id: string
  list: {
    name: string
    per: number
    votes: TokenAmount | undefined
  }[]
  token: Token
}) {
  const { chainId } = useActiveWeb3React()
  const { result, loading, page } = useProposalVoteList(votingAddress, id)
  const showList = useMemo(() => {
    return result.map(item => ({
      address: (
        <Link target={'_blank'} href={chainId ? getEtherscanLink(chainId, item.address, 'address') : undefined}>
          {shortenAddress(item.address)}
        </Link>
      ),
      choose: list[item.optionIndex].name,
      votes: new TokenAmount(token, item.votes).toSignificant(6, { groupSeparator: ',' }),
      hash: (
        <Link target={'_blank'} href={chainId ? getEtherscanLink(chainId, item.hash, 'transaction') : undefined}>
          {shortenHashAddress(item.hash)}
        </Link>
      )
    }))
  }, [chainId, list, result, token])

  return (
    <Modal closeIcon>
      <Box display="grid" gap="20px" width="100%">
        <Typography variant="h6">Vote list</Typography>
      </Box>
      <Table
        className="panel-config stp-table"
        loading={loading}
        dataSource={showList}
        rowKey={'id'}
        pagination={false}
      >
        <Column align="center" title="Users" dataIndex="address" key="address" />
        <Column align="center" title="Voting Option" dataIndex="choose" key="choose" />
        <Column title="Votes" dataIndex="votes" key="votes" align="center" />
        <Column title="Hash" dataIndex="hash" key="hash" align="center" />
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
    </Modal>
  )
}
