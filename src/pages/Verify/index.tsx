import { Box, Link, Switch, Typography, useTheme } from '@mui/material'
import { Pagination, Progress, Table } from 'antd'
import { useMemo, useState } from 'react'
import VerifyHeader from './VerifyHeader'
import Image from 'components/Image'
import {
  useMyStakedDao,
  useStakeDaoBaseInfo,
  useStakeDaoList,
  useVerificationThreshold,
  useVerifiedDaoByIds
} from 'hooks/useStakeVerified'
import { useActiveWeb3React } from 'hooks'
import { TokenAmount } from 'constants/token'
import OutlineButton from 'components/Button/OutlineButton'
import JSBI from 'jsbi'

export default function Verify() {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const [myStakeOnly, setMyStakeOnly] = useState(false)
  const { page, list: stakeDaoList, loading } = useStakeDaoList()

  const stakeDaoListIds = useMemo(() => stakeDaoList.map(i => i.daoId), [stakeDaoList])
  const verifiedDaoByIdsData = useVerifiedDaoByIds(stakeDaoListIds)

  const myStakedDaoVerifiedDaoData = useMyStakedDao()

  const daoListTable = useMemo(
    () =>
      stakeDaoList.map((item, index) => ({
        name: <ShowDaoName daoId={item.daoId} daoAddress={item.daoAddress} />,
        progress: <ShowProgress stakedAmountTotal={verifiedDaoByIdsData?.[index].stakedAmountTotal} />,
        stake: (
          <Typography fontSize={13}>
            {account ? verifiedDaoByIdsData?.[index].myStakedAmount.toSignificant(6, { groupSeparator: ',' }) : '-'}
          </Typography>
        ),
        days: verifiedDaoByIdsData?.[index].verifiedTimestamp ? (
          <ShowVerifiedDays timeStamp={verifiedDaoByIdsData[index].verifiedTimestamp} />
        ) : (
          '-'
        ),
        action: <StakeAction myStakedAmount={verifiedDaoByIdsData?.[index].myStakedAmount} />
      })),
    [account, stakeDaoList, verifiedDaoByIdsData]
  )

  const myStakedDaoListTable = useMemo(
    () =>
      myStakedDaoVerifiedDaoData?.map(item => ({
        name: <ShowDaoName daoId={item.daoId} daoAddress={item.daoAddress} />,
        progress: <ShowProgress stakedAmountTotal={item.stakedAmountTotal} />,
        stake: <Typography fontSize={13}>{item.myStakedAmount.toSignificant(6, { groupSeparator: ',' })}</Typography>,
        days: item.verifiedTimestamp ? <ShowVerifiedDays timeStamp={item.verifiedTimestamp} /> : '-',
        action: <StakeAction myStakedAmount={item.myStakedAmount} />
      })) || [],
    [myStakedDaoVerifiedDaoData]
  )

  return (
    <Box padding="24px 56px 60px" maxWidth={1248}>
      <VerifyHeader />
      <Box mt={37}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography variant="h6" fontSize={16} fontWeight={600}>
            DAO List
          </Typography>
          {account && (
            <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
              <Switch checked={myStakeOnly} onChange={(_, value) => setMyStakeOnly(value)} />
              Stake only
            </Typography>
          )}
        </Box>
        {!myStakeOnly ? (
          <Box>
            <Table className="stp-table" loading={loading} dataSource={daoListTable} rowKey={'id'} pagination={false}>
              <Table.Column title="Name" width={'25%'} dataIndex="name" key="name" align="center" />
              <Table.Column title="Progress" width={250} align="center" dataIndex="progress" key="Progress" />
              <Table.Column title="My stake (STPT)" dataIndex="stake" key="stake" align="center" />
              <Table.Column title="Verified days" dataIndex="days" key="days" align="center" />
              <Table.Column title="Action" dataIndex="action" key="action" align="center" />
            </Table>
            <Box display={'flex'} justifyContent={'center'} mt={100}>
              <Pagination
                simple
                size="default"
                hideOnSinglePage
                pageSize={page.pageSize}
                current={page.currentPage}
                total={page.total}
                onChange={p => page.setCurrentPage(p)}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Table
              className="stp-table"
              loading={false}
              dataSource={myStakedDaoListTable}
              rowKey={'id'}
              pagination={false}
            >
              <Table.Column title="Name" width={'25%'} dataIndex="name" key="name" align="center" />
              <Table.Column title="Progress" width={250} align="center" dataIndex="progress" key="Progress" />
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

function ShowDaoName({ daoId, daoAddress }: { daoId: number; daoAddress: string }) {
  const info = useStakeDaoBaseInfo(daoId, daoAddress)
  return (
    <Box display={'flex'} alignItems={'center'} gap={5} paddingLeft="20%">
      <Image src={info?.logo || ''} width={40} height={40} style={{ borderRadius: '50%' }}></Image>
      <Link href={`/#/cross_detail/${daoAddress}`} underline="none">
        <Typography>{info?.daoName || '--'}</Typography>
      </Link>
    </Box>
  )
}

function ShowProgress({ stakedAmountTotal }: { stakedAmountTotal: TokenAmount | undefined }) {
  const theme = useTheme()
  const verificationThreshold = useVerificationThreshold()

  const pro = useMemo(() => {
    if (stakedAmountTotal && verificationThreshold) {
      return Number(stakedAmountTotal.divide(verificationThreshold).toSignificant(2)) * 100
    }
    return 0
  }, [stakedAmountTotal, verificationThreshold])

  return (
    <Box display={'flex'}>
      <Progress percent={pro} style={{ width: 80 }} showInfo={false} />
      <Typography fontSize={13} fontWeight={'400!important'} color={theme.palette.text.secondary}>
        {pro}%({stakedAmountTotal?.toSignificant(6, { groupSeparator: ',' }) || '--'}/
        {verificationThreshold?.toSignificant(6, { groupSeparator: ',' }) || '--'})
      </Typography>
    </Box>
  )
}

function ShowVerifiedDays({ timeStamp }: { timeStamp: number }) {
  const str = useMemo(() => {
    const now = Math.ceil(new Date().getTime() / 1000)
    const gap = now - timeStamp
    if (gap < 3600 * 24) {
      return `<1`
    }
    return `${Number(gap / 86400).toFixed()}`
  }, [timeStamp])
  return <Typography fontSize={13}>{str}</Typography>
}

function StakeAction({ myStakedAmount }: { myStakedAmount: TokenAmount | undefined }) {
  const { account } = useActiveWeb3React()
  return (
    <Box
      display={'flex'}
      gap={6}
      justifyContent="center"
      sx={{
        '& *': {
          fontWeight: '500!important',
          fontSize: 12
        },
        '& button': {
          borderWidth: 1
        }
      }}
    >
      {account && (
        <OutlineButton width={92} height={24}>
          Stake
        </OutlineButton>
      )}
      {myStakedAmount && myStakedAmount.greaterThan(JSBI.BigInt(0)) && (
        <OutlineButton width={92} height={24}>
          Unstake
        </OutlineButton>
      )}
    </Box>
  )
}
