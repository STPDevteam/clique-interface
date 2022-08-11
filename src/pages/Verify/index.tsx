import { Box, Link, styled, Switch, Typography, useTheme } from '@mui/material'
import { Pagination, Progress, Table } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import VerifyHeader from './VerifyHeader'
import Image from 'components/Image'
import {
  StakedDaoInfoProp,
  useMyStakedDao,
  useStakeDaoBaseInfo,
  useStakeDaoList,
  useStakeSTPTToken,
  useVerificationThreshold,
  useVerifiedDaoByIds
} from 'hooks/useStakeVerified'
import { useActiveWeb3React } from 'hooks'
import { TokenAmount } from 'constants/token'
import OutlineButton from 'components/Button/OutlineButton'
import JSBI from 'jsbi'
import Modal from 'components/Modal'
import useModal from 'hooks/useModal'
import Button from 'components/Button/Button'
import InputNumerical from 'components/Input/InputNumerical'
import { useTokenBalance } from 'state/wallet/hooks'
import { DAO_VERIFIER_ADDRESS, SUPPORT_STAKE_VERIFY_NETWORK } from '../../constants'
import { tryParseAmount, useWalletModalToggle } from 'state/application/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useStakeVerifiedCallback, useUnStakeVerifiedCallback } from 'hooks/useStakeVerifiedCallback'
import { Dots } from 'theme/components'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { Rounding } from 'constants/token/constants'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useHistory } from 'react-router-dom'

const StyledAmountPanel = styled(Box)({
  background: '#FBFCFC',
  borderRadius: '8px',
  padding: '10px',
  margin: '12px 0 20px'
})

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
      verifiedDaoByIdsData?.map(
        item =>
          ({
            name: <ShowDaoName daoId={item.daoId} daoAddress={item.daoAddress} />,
            progress: <ShowProgress stakedAmountTotal={item.stakedAmountTotal} />,
            stake: (
              <Typography fontSize={13}>
                {account ? item.myStakedAmount.toSignificant(6, { groupSeparator: ',' }) : '-'}
              </Typography>
            ),
            days: item.verifiedTimestamp ? <ShowVerifiedDays timeStamp={item.verifiedTimestamp} /> : '-',
            action: <StakeAction {...item} />
          } || [])
      ),
    [account, verifiedDaoByIdsData]
  )

  const myStakedDaoListTable = useMemo(
    () =>
      myStakedDaoVerifiedDaoData?.map(item => ({
        name: <ShowDaoName daoId={item.daoId} daoAddress={item.daoAddress} />,
        progress: <ShowProgress stakedAmountTotal={item.stakedAmountTotal} />,
        stake: <Typography fontSize={13}>{item.myStakedAmount.toSignificant(6, { groupSeparator: ',' })}</Typography>,
        days: item.verifiedTimestamp ? <ShowVerifiedDays timeStamp={item.verifiedTimestamp} /> : '-',
        action: <StakeAction {...item} />
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
              My staking
            </Typography>
          )}
        </Box>
        {!myStakeOnly ? (
          <Box>
            <Table
              className="stp-table"
              loading={loading || !daoListTable}
              dataSource={daoListTable}
              rowKey={'id'}
              pagination={false}
            >
              <Table.Column title="DAO Name" width={'25%'} dataIndex="name" key="name" align="center" />
              <Table.Column title="Staked Amount" width={260} align="center" dataIndex="progress" key="Progress" />
              <Table.Column title="My staking (STPT)" dataIndex="stake" key="stake" align="center" />
              <Table.Column title="Verified days" dataIndex="days" key="days" align="center" />
              <Table.Column title="Action" width={200} dataIndex="action" key="action" align="center" />
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
              <Table.Column title="DAO Name" width={'25%'} dataIndex="name" key="name" align="center" />
              <Table.Column title="Staked Amount" width={260} align="center" dataIndex="progress" key="Progress" />
              <Table.Column title="My staking (STPT)" dataIndex="stake" key="stake" align="center" />
              <Table.Column title="Verified days" dataIndex="days" key="days" align="center" />
              <Table.Column title="Action" width={200} dataIndex="action" key="action" align="center" />
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function ShowDaoName({
  daoId,
  daoAddress,
  paddingLeft,
  hideLink
}: {
  daoId: number
  daoAddress: string
  paddingLeft?: string | number
  hideLink?: boolean
}) {
  const history = useHistory()
  const info = useStakeDaoBaseInfo(daoId, daoAddress)
  return (
    <Box display={'flex'} alignItems={'center'} gap={5} paddingLeft={paddingLeft || '20%'}>
      <Image src={info?.logo || ''} width={40} height={40} style={{ borderRadius: '50%' }}></Image>
      {hideLink ? (
        <Typography fontWeight={600} fontSize={14} color="#1B1D21">
          {info?.daoName || '--'}
        </Typography>
      ) : (
        <Link onClick={() => history.push(`/cross_detail/${daoAddress}`)} underline="none">
          <Typography fontWeight={600}>{info?.daoName || '--'}</Typography>
        </Link>
      )}
    </Box>
  )
}

function ShowProgress({ stakedAmountTotal }: { stakedAmountTotal: TokenAmount | undefined }) {
  const theme = useTheme()
  const verificationThreshold = useVerificationThreshold()

  const pro = useMemo(() => {
    if (stakedAmountTotal && verificationThreshold) {
      return Number(
        stakedAmountTotal
          .multiply(JSBI.BigInt(100))
          .divide(verificationThreshold)
          .toSignificant(10, { groupSeparator: '' }, Rounding.ROUND_DOWN)
      )
    }
    return 0
  }, [stakedAmountTotal, verificationThreshold])

  const showProgressStr = useMemo(() => {
    if (pro === 0) {
      return '0'
    }
    if (pro < 1) {
      return '<1'
    }
    return Number(Math.floor(pro))
  }, [pro])

  return (
    <Box display={'flex'}>
      <Progress percent={Number(Math.floor(pro))} style={{ width: 80 }} showInfo={false} />
      <Typography fontSize={13} fontWeight={'400!important'} color={theme.palette.text.secondary}>
        {showProgressStr}%({stakedAmountTotal?.toSignificant(6, { groupSeparator: ',' }) || '--'}/
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

function StakeAction(data: StakedDaoInfoProp) {
  const { myStakedAmount, daoId } = data
  const { account, chainId, library } = useActiveWeb3React()
  const { showModal } = useModal()
  const { claimSubmitted: stakePending } = useUserHasSubmittedClaim(`${account}_stake_verify_${daoId}`)
  const { claimSubmitted: unStakePending } = useUserHasSubmittedClaim(`${account}_unStake_verify_${daoId}`)
  const toggleWalletModal = useWalletModalToggle()

  return (
    <Box
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
      {!account ? (
        <Box display={'flex'} gap={6} justifyContent="center">
          <OutlineButton width={120} fontSize={12} height={24} onClick={toggleWalletModal}>
            Connect Wallet
          </OutlineButton>
        </Box>
      ) : chainId === SUPPORT_STAKE_VERIFY_NETWORK ? (
        <Box display={'flex'} gap={6} width="100%">
          {stakePending ? (
            <OutlineButton width={92} height={24} disabled>
              Stake
              <Dots />
            </OutlineButton>
          ) : (
            <OutlineButton width={92} height={24} onClick={() => showModal(<StakeModal {...data} type="stake" />)}>
              Stake
            </OutlineButton>
          )}
          {myStakedAmount &&
            myStakedAmount.greaterThan(JSBI.BigInt(0)) &&
            (unStakePending ? (
              <OutlineButton width={92} height={24} disabled>
                Unstake
                <Dots />
              </OutlineButton>
            ) : (
              <OutlineButton width={92} height={24} onClick={() => showModal(<StakeModal {...data} type="unStake" />)}>
                Unstake
              </OutlineButton>
            ))}
        </Box>
      ) : (
        <Box display={'flex'} gap={6} justifyContent="center">
          <OutlineButton
            width={120}
            fontSize={12}
            height={24}
            onClick={() => triggerSwitchChain(library, SUPPORT_STAKE_VERIFY_NETWORK, account)}
          >
            Switch network
          </OutlineButton>
        </Box>
      )}
    </Box>
  )
}

function StakeModal({
  daoId,
  daoAddress,
  stakedAmountTotal,
  type,
  myStakedAmount
}: StakedDaoInfoProp & { type: 'stake' | 'unStake' }) {
  const { account, chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  useEffect(() => {
    if (chainId !== SUPPORT_STAKE_VERIFY_NETWORK) hideModal()
  }, [chainId, hideModal])

  const theme = useTheme()
  const verificationThreshold = useVerificationThreshold()
  const stakeToken = useStakeSTPTToken()
  const userTokenBalance = useTokenBalance(account || undefined, stakeToken || undefined)
  const [stakeInput, setStakeInput] = useState('')
  const [unStakeInput, setUnStakeInput] = useState('')
  const stakeAmount = tryParseAmount(stakeInput, stakeToken || undefined)
  const unStakeAmount = tryParseAmount(unStakeInput, stakeToken || undefined)
  const toggleWalletModal = useWalletModalToggle()
  const stakeVerifiedCallback = useStakeVerifiedCallback()
  const unStakeVerifiedCallback = useUnStakeVerifiedCallback()
  const { claimSubmitted: stakePending } = useUserHasSubmittedClaim(`${account}_stake_verify_${daoId}`)
  const { claimSubmitted: unStakePending } = useUserHasSubmittedClaim(`${account}_unStake_verify_${daoId}`)

  const curStakeAddress = useMemo(
    () =>
      chainId === SUPPORT_STAKE_VERIFY_NETWORK && DAO_VERIFIER_ADDRESS[chainId]
        ? DAO_VERIFIER_ADDRESS[chainId]
        : undefined,
    [chainId]
  )
  const [stakeApprovalState, stakeApprovalCallback] = useApproveCallback(stakeAmount, curStakeAddress)

  const onStakeVerifiedCallback = useCallback(() => {
    if (!daoId || !stakeAmount) return
    showModal(<TransactionPendingModal />)
    stakeVerifiedCallback(daoId, stakeAmount)
      .then(hash => {
        showModal(<TransactionSubmittedModal hash={hash} />)
      })
      .catch(err => {
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [daoId, showModal, stakeAmount, stakeVerifiedCallback])

  const onUnStakeVerifiedCallback = useCallback(() => {
    if (!daoId || !unStakeAmount) return
    showModal(<TransactionPendingModal />)
    unStakeVerifiedCallback(daoId, unStakeAmount)
      .then(hash => {
        showModal(<TransactionSubmittedModal hash={hash} />)
      })
      .catch(err => {
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [daoId, showModal, unStakeAmount, unStakeVerifiedCallback])

  const stakeBtn = useMemo(() => {
    if (!account) {
      return <Button onClick={toggleWalletModal}>Connect Wallet</Button>
    }
    if (stakePending) {
      return (
        <Button disabled>
          Staking
          <Dots />
        </Button>
      )
    }
    if (!stakeAmount || !stakeAmount.greaterThan(JSBI.BigInt(0))) {
      return <Button disabled>Input amount</Button>
    }
    if (!userTokenBalance || userTokenBalance.lessThan(stakeAmount)) {
      return <Button disabled>Balance Insufficient</Button>
    }

    if (stakeApprovalState !== ApprovalState.APPROVED) {
      if (stakeApprovalState === ApprovalState.PENDING) {
        return (
          <Button disabled>
            Approve
            <Dots />
          </Button>
        )
      } else if (stakeApprovalState === ApprovalState.NOT_APPROVED) {
        return <Button onClick={stakeApprovalCallback}>Approve</Button>
      } else {
        return <Button disabled>Loading</Button>
      }
    }

    return <Button onClick={onStakeVerifiedCallback}>Stake</Button>
  }, [
    account,
    stakePending,
    stakeAmount,
    userTokenBalance,
    stakeApprovalState,
    onStakeVerifiedCallback,
    toggleWalletModal,
    stakeApprovalCallback
  ])

  const unStakeBtn = useMemo(() => {
    if (!account) {
      return <Button onClick={toggleWalletModal}>Connect Wallet</Button>
    }
    if (unStakePending) {
      return (
        <Button disabled>
          UnStake
          <Dots />
        </Button>
      )
    }
    if (!unStakeAmount || !unStakeAmount.greaterThan(JSBI.BigInt(0))) {
      return <Button disabled>Input amount</Button>
    }
    if (myStakedAmount.lessThan(unStakeAmount)) {
      return <Button disabled>Staked Balance Insufficient</Button>
    }

    return <Button onClick={onUnStakeVerifiedCallback}>UnStake</Button>
  }, [account, unStakePending, unStakeAmount, myStakedAmount, onUnStakeVerifiedCallback, toggleWalletModal])

  return (
    <Modal closeIcon maxWidth="500px">
      <Typography variant="h6" fontWeight={500} fontSize={16}>
        {type === 'stake' ? 'Staking STPT (ERC20)' : 'Unstaking STPT (ERC20)'}
      </Typography>
      <Box margin="20px 0" display={'grid'} gap="12px">
        <Box display={'flex'} justifyContent="space-between">
          <Typography fontSize={13} fontWeight={400} color={theme.palette.text.secondary}>
            Verify DAO
          </Typography>
          <Typography fontSize={13} fontWeight={400} color={theme.palette.text.secondary}>
            Staked
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <ShowDaoName daoId={daoId} daoAddress={daoAddress} paddingLeft={'0'} hideLink />
          <Typography fontWeight={600} fontSize={14} color="#1B1D21">
            {stakedAmountTotal?.toSignificant(6, { groupSeparator: ',' }) || '--'}/
            {verificationThreshold?.toSignificant(6, { groupSeparator: ',' }) || '--'}
          </Typography>
        </Box>

        {type === 'stake' ? (
          <Box>
            <StyledAmountPanel>
              <InputNumerical
                onMax={() => setStakeInput(userTokenBalance?.toSignificant() || '')}
                label="Amount"
                balance={userTokenBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'}
                unit={stakeToken?.symbol}
                onChange={e => setStakeInput(e.target.value || '')}
                value={stakeInput}
              />
            </StyledAmountPanel>
            {stakeBtn}
          </Box>
        ) : (
          <Box>
            <StyledAmountPanel>
              <InputNumerical
                onMax={() => setUnStakeInput(myStakedAmount?.toSignificant() || '')}
                label="Amount"
                balance={myStakedAmount?.toSignificant(6, { groupSeparator: ',' }) || '-'}
                unit={stakeToken?.symbol}
                onChange={e => setUnStakeInput(e.target.value || '')}
                value={unStakeInput}
              />
            </StyledAmountPanel>
            {unStakeBtn}
          </Box>
        )}
      </Box>
    </Modal>
  )
}
