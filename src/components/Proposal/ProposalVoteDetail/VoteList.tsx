import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import { Table } from 'antd'
import Column from 'antd/lib/table/Column'
import { shortenAddress } from 'utils'
import STPPagination from 'components/Pagination/STPPagination'

export default function VoteList() {
  const data = ' '
    .repeat(4)
    .split(' ')
    .map((item, index) => ({
      id: index + 1,
      address: '0x18041866663b077bB6BF2bAFFAeA2451a2472ed7',
      shortAddress: shortenAddress('0x18041866663b077bB6BF2bAFFAeA2451a2472ed7'),
      choose: 'Aggree',
      votes: 100
    }))
  return (
    <Modal closeIcon>
      <Box display="grid" gap="20px" width="100%">
        <Typography variant="h6">Vote list</Typography>
      </Box>
      <Table className="panel-config stp-table" dataSource={data} rowKey={'id'} pagination={false}>
        <Column align="center" title="Users" dataIndex="shortAddress" key="address" />
        <Column align="center" title="Choose" dataIndex="choose" key="choose" />
        <Column title="Votes" dataIndex="votes" key="votes" align="center" />
      </Table>
      <STPPagination count={1} page={1} />
    </Modal>
  )
}
