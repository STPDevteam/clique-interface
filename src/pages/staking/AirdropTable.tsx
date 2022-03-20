import { useCallback, useMemo } from 'react'
import { AirdropResProp, useAirdropList } from 'hooks/staking/useServerData'
import { timeStampToFormat } from 'utils/dao'
import { ExternalLink } from 'theme/components'
import Image from 'components/Image'
import { ReactComponent as OpenGarpLink } from 'assets/svg/open-gary-link.svg'
import { Pagination, Table } from 'antd'
import { Box, styled, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import { useTimeStampByBlockNumber, useUserAirdropClaimable, useUserAirdropClaimed } from 'hooks/staking/useAirdropinfo'
import { useAirdropClaimCallback } from 'hooks/staking/useAirdropClaimCallback'
import { useActiveWeb3React } from 'hooks'
import { TokenAmount } from 'constants/token'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import JSBI from 'jsbi'
import { useBlockNumber } from 'state/application/hooks'
import { Timer } from 'components/Timer'

const TableText = styled(Typography)({
  color: '#22304A',
  fontSize: 16,
  fontWeight: 500
})
const { Column } = Table

export default function AirdropTable() {
  const { list: airdropListData, loading: airdropListLoading, page: airdropListPage } = useAirdropList()
  const curBlockNumber = useBlockNumber()
  const curBlockTime = useTimeStampByBlockNumber(curBlockNumber)
  console.log('🚀 ~ file: AirdropTable.tsx ~ line 32 ~ AirdropTable ~ curBlockTime', curBlockTime)

  const airdropList = useMemo(
    () =>
      airdropListData.map(item => ({
        token: (
          <Box display={'flex'} alignItems="center" gap="2px" justifyContent={'center'}>
            <Image width={'24px'} height="24px" src={item.tokenLogo} />
            <TableText>{item.token?.name || '--'}</TableText>
            {item.mediumLink && (
              <ExternalLink href={item.mediumLink}>
                <OpenGarpLink width={16} height={16} style={{ marginTop: '6px' }} />
              </ExternalLink>
            )}
          </Box>
        ),
        totalAirdrop: (
          <TableText>
            {item.airdropAmount ? item.airdropAmount.toSignificant(6, { groupSeparator: ',' }) : '--'}{' '}
            {item.token?.symbol}
          </TableText>
        ),
        startDate: <TableText>{timeStampToFormat(item.startTime)}</TableText>,
        // blockNumber: <TableText>{item.blockNumber}</TableText>,
        rewards: <MyRewards item={item} />,
        claimed: <Claimed airdropId={item.airdropId} />,
        operation: curBlockTime ? <ClaimOperation item={item} curBlockTime={curBlockTime} /> : ''
      })),
    [airdropListData, curBlockTime]
  )
  return (
    <>
      <Table
        className="panel-config stp-table"
        loading={airdropListLoading}
        dataSource={airdropList}
        rowKey={'id'}
        pagination={false}
      >
        <Column title="Token" dataIndex="token" key="token" align="center" />
        <Column align="center" title="Total airdrop" dataIndex="totalAirdrop" key="totalAirdrop" />
        <Column align="center" title="Start time(estimate)" dataIndex="startDate" key="startDate" />
        {/* <Column align="center" title="Start block number" dataIndex="blockNumber" key="blockNumber" /> */}
        <Column align="center" title="My est. rewards" dataIndex="rewards" key="rewards" />
        <Column title="Claimed" dataIndex="claimed" key="claimed" align="center" />
        <Column title="Operation" dataIndex="operation" key="operation" align="center" />
      </Table>

      <Box display={'flex'} justifyContent="center">
        <Pagination
          simple
          size="default"
          hideOnSinglePage
          pageSize={airdropListPage.pageSize}
          style={{ marginTop: 20 }}
          current={airdropListPage.currentPage}
          total={airdropListPage.total}
          onChange={e => airdropListPage.setCurrentPage(e)}
        />
      </Box>
    </>
  )
}

function MyRewards({ item }: { item: AirdropResProp }) {
  const { account } = useActiveWeb3React()
  const { result } = useUserAirdropClaimable(account || undefined, item.airdropId)

  const amount = useMemo(() => {
    if (result !== undefined && item.token) {
      return new TokenAmount(item.token, result)
    }
    return undefined
  }, [item.token, result])

  return (
    <TableText>
      {amount?.toSignificant(6, { groupSeparator: ',' }) || '-'}
      {' ' + (item.token?.symbol || '')}
    </TableText>
  )
}

function Claimed({ airdropId }: { airdropId: number }) {
  const { account } = useActiveWeb3React()
  const { result } = useUserAirdropClaimed(account || undefined, airdropId)

  const str = useMemo(() => {
    if (result === undefined) return '-'
    return result === true ? 'yes' : '-'
  }, [result])

  return <TableText>{str}</TableText>
}

function ClaimOperation({ item, curBlockTime }: { item: AirdropResProp; curBlockTime: number }) {
  const { showModal } = useModal()
  const { account } = useActiveWeb3React()
  const { result: claimable } = useUserAirdropClaimable(account || undefined, item.airdropId)
  const { result: claimed } = useUserAirdropClaimed(account || undefined, item.airdropId)

  const airdropClaimCallback = useAirdropClaimCallback()
  const onAirdropClaimCallback = useCallback(
    (id: number) => {
      airdropClaimCallback(id)
        .then(hash => {
          showModal(<TransactionSubmittedModal hash={hash} />)
        })
        .catch(err => {
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [airdropClaimCallback, showModal]
  )

  const btn = useMemo(() => {
    if (!account) {
      return ''
    }
    if (curBlockTime < item.startTime) {
      return (
        <Button disabled height="24px" width="140px" style={{ borderRadius: '4px', fontSize: 12 }}>
          start at <Timer showDay timer={item.startTime} />
        </Button>
      )
    }
    if (!claimable || !JSBI.GT(JSBI.BigInt(claimable), JSBI.BigInt(0)) || claimed === undefined || claimed) {
      return (
        <Button disabled height="24px" width="140px" style={{ borderRadius: '4px', fontSize: 12 }}>
          Claim
        </Button>
      )
    }
    return (
      <Button
        onClick={() => onAirdropClaimCallback(item.airdropId)}
        height="24px"
        width="140px"
        style={{ borderRadius: '4px', fontSize: 12 }}
      >
        Claim
      </Button>
    )
  }, [account, claimable, claimed, curBlockTime, item.airdropId, item.startTime, onAirdropClaimCallback])

  return <>{btn}</>
}
