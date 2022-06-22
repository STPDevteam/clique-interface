import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import { Pagination, Table } from 'antd'
import Column from 'antd/lib/table/Column'
import { useProposalVoteList } from 'hooks/useBackedServer'
import { Token, TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import { shortenAddress } from 'utils'

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
  const { result, loading, page } = useProposalVoteList(votingAddress, id)
  const showList = useMemo(() => {
    return result.map(item => ({
      address: shortenAddress(item.address),
      choose: list[item.optionIndex].name,
      votes: new TokenAmount(token, item.votes).toSignificant(6, { groupSeparator: ',' })
    }))
  }, [list, result, token])

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
