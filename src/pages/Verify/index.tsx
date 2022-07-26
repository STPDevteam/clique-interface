import { Box, Switch, Typography, useTheme } from '@mui/material'
import { Pagination, Progress, Table } from 'antd'
import { useMemo, useState } from 'react'
import VerifyHeader from './VerifyHeader'
import Image from 'components/Image'

export default function Verify() {
  const theme = useTheme()
  const [myStakeOnly, setMyStakeOnly] = useState(false)

  const daoList = useMemo(() => {
    return [
      {
        name: <ShowDaoName />,
        progress: <ShowProgress />,
        stake: <Typography fontSize={13}>1,000</Typography>,
        days: <Typography fontSize={13}>1</Typography>,
        action: <></>
      }
    ]
  }, [])

  return (
    <Box padding="24px 56px 60px" maxWidth={1248}>
      <VerifyHeader />
      <Box mt={37}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography variant="h6" fontSize={16} fontWeight={600}>
            DAO List
          </Typography>
          <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
            <Switch checked={myStakeOnly} onChange={(_, value) => setMyStakeOnly(value)} />
            Stake only
          </Typography>
        </Box>
        {!myStakeOnly ? (
          <Box>
            <Table className="stp-table" loading={false} dataSource={daoList} rowKey={'id'} pagination={false}>
              <Table.Column title="Name" dataIndex="name" key="name" align="center" />
              <Table.Column title="Progress" align="center" dataIndex="progress" key="Progress" />
              <Table.Column title="My stake (STPT)" dataIndex="stake" key="stake" align="center" />
              <Table.Column title="Verified days" dataIndex="days" key="days" align="center" />
              <Table.Column title="Action" dataIndex="action" key="action" align="center" />
            </Table>
            <Box display={'flex'} justifyContent={'center'} mt={100}>
              <Pagination simple size="default" hideOnSinglePage pageSize={10} current={5} total={50} />
            </Box>
          </Box>
        ) : (
          <Box>
            <Table className="stp-table" loading={false} dataSource={[]} rowKey={'id'} pagination={false}>
              <Table.Column title="Name" dataIndex="name" key="name" align="center" />
              <Table.Column title="Progress" align="center" dataIndex="name" key="name" />
              <Table.Column title="My stake (STPT)" dataIndex="stake" key="stake" align="center" />
              <Table.Column title="Verified days" dataIndex="days" key="days" align="center" />
              <Table.Column title="Action" dataIndex="action" key="action" align="center" />
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function ShowDaoName() {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
      <Image src={''} width={40} height={40} style={{ borderRadius: '50%' }}></Image>
      <Typography>DAO Name2</Typography>
    </Box>
  )
}

function ShowProgress() {
  return (
    <Box>
      <Progress />
    </Box>
  )
}
