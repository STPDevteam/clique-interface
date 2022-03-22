import { Box, Grid, styled, Typography } from '@mui/material'
import { Input } from 'antd'
import Button from 'components/Button/Button'
import { BAST_TOKEN, FARM_STAKING_ADDRESS } from '../../constants'
import { useCallback, useMemo, useState } from 'react'
import StakingHeader from './StakingHeader'
import TextIntr from './TextIntr'
import { useActiveWeb3React } from 'hooks'
import { useStakeInfo } from 'hooks/staking/useStakeinfo'
import { useTokenBalance } from 'state/wallet/hooks'
import { tryParseAmount, useWalletModalToggle } from 'state/application/hooks'
import JSBI from 'jsbi'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'theme/components'
import { useStakeCallback, useCancelStakeCallback } from 'hooks/staking/useStakeCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { Link } from 'react-router-dom'
import AirdropTable from './AirdropTable'

const Main = styled('main')({
  display: 'flex',
  justifyContent: 'center',
  padding: '48px 20px'
})

const Container = styled(Box)({
  width: '100%',
  maxWidth: 967
})

const MaxBtn = styled(Box)({
  background: '#D5EDFF',
  border: '2px solid #FFFFFF',
  borderRadius: '20px',
  marginRight: '8px',
  height: 24,
  fontSize: 12,
  padding: '2px 16px',
  cursor: 'pointer',
  boxShadow: 'inset -3px -3px 4px rgba(255, 255, 255, 0.88), inset 2px 2px 7px rgba(73, 103, 134, 0.36)',
  filter: 'drop-shadow(-1px -1px 4px #FFFFFF) drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.16))'
})
const StyledTabBox = styled(Box)({
  margin: '10px auto 15px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  '& .item': {
    width: 115,
    display: 'flex',
    justifyContent: 'center',
    height: 40,
    cursor: 'pointer',
    color: '#22304A',
    fontWeight: 500,
    alignItems: 'center',
    border: '1px solid #3898FC',
    '&:first-child': {
      borderRadius: '8px 0px 0px 8px'
    },
    '&:last-child': {
      borderRadius: '0px 8px 8px 0px'
    }
  },
  '& .active': {
    background: '#3898FC',
    color: '#fff'
  }
})

type TabOption = 'Stake' | 'Unstake'

export default function Index() {
  const [stakeInput, setStakeInput] = useState('')
  const [unStakeInput, setUnStakeInput] = useState('')
  const [tabInfo, setTabInfo] = useState<TabOption>('Stake')
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()

  const { result: stakeInfo } = useStakeInfo(account || undefined)

  const curSTPT = useMemo(() => (chainId ? BAST_TOKEN[chainId] : undefined), [chainId])
  const curStakeAddress = useMemo(
    () => (chainId && FARM_STAKING_ADDRESS[chainId] ? FARM_STAKING_ADDRESS[chainId] : undefined),
    [chainId]
  )
  const stptBalance = useTokenBalance(account || undefined, curSTPT)

  const stakeAmount = useMemo(() => tryParseAmount(stakeInput, curSTPT), [curSTPT, stakeInput])
  const unStakeAmount = useMemo(() => tryParseAmount(unStakeInput, curSTPT), [curSTPT, unStakeInput])

  const [stakeApprovalState, stakeApprovalCallback] = useApproveCallback(stakeAmount, curStakeAddress)

  const stakeCallback = useStakeCallback()
  const onStakeCallback = useCallback(() => {
    if (!stakeAmount) return
    showModal(<TransactionPendingModal />)
    stakeCallback(stakeAmount.raw.toString())
      .then(hash => {
        hideModal()
        setStakeInput('')
        showModal(<TransactionSubmittedModal hash={hash} />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, showModal, stakeAmount, stakeCallback])

  const cancelStakeCallback = useCancelStakeCallback()
  const onCancelStakeCallback = useCallback(() => {
    if (!unStakeAmount) return
    showModal(<TransactionPendingModal />)
    cancelStakeCallback(unStakeAmount.raw.toString())
      .then(hash => {
        hideModal()
        setUnStakeInput('')
        showModal(<TransactionSubmittedModal hash={hash} />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [cancelStakeCallback, hideModal, showModal, unStakeAmount])

  const stakeBtn = useMemo(() => {
    if (!account) {
      return (
        <Button style={{ padding: '0 15px', width: 'auto' }} height="40px" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      )
    }
    if (!stakeAmount || !stakeAmount.greaterThan(JSBI.BigInt(0))) {
      return (
        <Button width="120px" height="40px">
          Stake
        </Button>
      )
    }

    if (!stptBalance || stptBalance.lessThan(stakeAmount)) {
      return (
        <Button style={{ padding: '0 15px', width: 'auto' }} height="40px" disabled>
          Balance Insufficient
        </Button>
      )
    }
    if (stakeApprovalState !== ApprovalState.APPROVED) {
      if (stakeApprovalState === ApprovalState.PENDING) {
        return (
          <Button style={{ padding: '0 15px', width: 'auto' }} height="40px" disabled>
            Approve
            <Dots />
          </Button>
        )
      } else if (stakeApprovalState === ApprovalState.NOT_APPROVED) {
        return (
          <Button onClick={stakeApprovalCallback} style={{ padding: '0 15px', width: 'auto' }} height="40px">
            Approve
          </Button>
        )
      } else {
        return (
          <Button disabled height="40px" style={{ padding: '0 15px', width: 'auto' }}>
            Loading
          </Button>
        )
      }
    }

    return (
      <Button width="120px" height="40px" onClick={onStakeCallback}>
        Stake
      </Button>
    )
  }, [account, onStakeCallback, stakeAmount, stakeApprovalCallback, stakeApprovalState, stptBalance, toggleWalletModal])

  const unStakeBtn = useMemo(() => {
    if (!account) {
      return (
        <Button style={{ padding: '0 15px', width: 'auto' }} height="40px" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      )
    }
    if (!unStakeAmount || !unStakeAmount.greaterThan(JSBI.BigInt(0))) {
      return (
        <Button width="120px" height="40px">
          unStake
        </Button>
      )
    }

    if (!stakeInfo?.stakeAmt || stakeInfo.stakeAmt.lessThan(unStakeAmount)) {
      return (
        <Button style={{ padding: '0 15px', width: 'auto' }} height="40px" disabled>
          Staked Insufficient
        </Button>
      )
    }

    return (
      <Button width="120px" height="40px" onClick={onCancelStakeCallback}>
        unStake
      </Button>
    )
  }, [account, stakeInfo?.stakeAmt, toggleWalletModal, onCancelStakeCallback, unStakeAmount])

  return (
    <Box>
      <StakingHeader />
      <Main>
        <Container>
          <Box>
            <Grid container spacing={20}>
              <Grid item lg={6} xs={12}>
                <Box pt={'32px'}>
                  <Box mb={'27px'}>
                    <Typography variant="body1" mb={'10px'}>
                      My staked STPT
                    </Typography>
                    <Typography variant="h5" fontSize={'32px'} fontWeight={600}>
                      {stakeInfo ? stakeInfo.stakeAmt.toSignificant(6, { groupSeparator: ',' }) : '--'}
                    </Typography>
                  </Box>
                  <Box mb={'27px'}>
                    <Typography variant="body1" mb={'5px'}>
                      My weighting
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stakeInfo ? stakeInfo.weight.toSignificant(6, { groupSeparator: ',' }) : '--'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Box
                  sx={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1)', borderRadius: '20px', padding: '20px 43px' }}
                >
                  <Box display={'flex'} justifyContent="center">
                    <StyledTabBox display={'flex'}>
                      <div
                        className={`item ${tabInfo === 'Stake' ? 'active' : ''}`}
                        onClick={() => setTabInfo('Stake')}
                      >
                        Stake
                      </div>
                      <div
                        className={`item ${tabInfo === 'Unstake' ? 'active' : ''}`}
                        onClick={() => setTabInfo('Unstake')}
                      >
                        Unstake
                      </div>
                    </StyledTabBox>
                  </Box>
                  {tabInfo === 'Stake' ? (
                    <Box>
                      <Box
                        sx={{
                          background: '#FAFAFA',
                          boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
                          borderRadius: '8px',
                          padding: '11px 30px',
                          marginBottom: 26
                        }}
                      >
                        <Box display={'flex'} justifyContent="space-between">
                          <Box>
                            <Typography variant="body1">Amount</Typography>
                            <Input
                              className="input-common"
                              placeholder="1"
                              style={{ minHeight: 'auto' }}
                              maxLength={10}
                              value={stakeInput}
                              onChange={e => {
                                const _val = e.target.value
                                if (isNaN(Number(_val))) return
                                const reg = new RegExp('^[0-9.]*$')
                                if (reg.test(_val)) {
                                  setStakeInput(_val)
                                }
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography textAlign={'right'} variant="body1" mb={'4px'}>
                              Balance: {stptBalance ? stptBalance.toSignificant(6, { groupSeparator: ',' }) : '-'}
                            </Typography>
                            <Box display={'flex'} flexDirection="row-reverse">
                              <Typography variant="h6" fontSize={'14px'} fontWeight={600}>
                                | STPT
                              </Typography>
                              <MaxBtn onClick={() => setStakeInput(stptBalance?.toSignificant(6) || '0')}>MAX</MaxBtn>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box display={'flex'} justifyContent="center">
                        {stakeBtn}
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          background: '#FAFAFA',
                          boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
                          borderRadius: '8px',
                          padding: '11px 30px'
                        }}
                      >
                        <Box display={'flex'} justifyContent="space-between">
                          <Box>
                            <Typography variant="body1">Amount</Typography>
                            <Input
                              className="input-common"
                              placeholder="1"
                              style={{ minHeight: 'auto' }}
                              maxLength={10}
                              value={unStakeInput}
                              onChange={e => {
                                const _val = e.target.value
                                if (isNaN(Number(_val))) return
                                const reg = new RegExp('^[0-9]*$')
                                if (reg.test(_val)) {
                                  setUnStakeInput(_val)
                                }
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography textAlign={'right'} variant="body1" mb={'4px'}>
                              Staked: {stakeInfo ? stakeInfo.stakeAmt.toSignificant(6, { groupSeparator: ',' }) : '-'}
                            </Typography>
                            <Box display={'flex'} flexDirection="row-reverse">
                              <Typography variant="h6" fontSize={'14px'} fontWeight={600}>
                                | STPT
                              </Typography>
                              <MaxBtn onClick={() => setUnStakeInput(stakeInfo?.stakeAmt?.toSignificant(6) || '0')}>
                                MAX
                              </MaxBtn>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" textAlign={'center'} margin="4.5px 0">
                        Your weighted value will be recalculated after the unstake.
                      </Typography>
                      <Box display={'flex'} justifyContent="center">
                        {unStakeBtn}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box mt="32px">
            <Box display={'flex'} alignItems="center">
              <Typography fontSize={'24px'} variant="h5" fontWeight={600}>
                Airdrop List
              </Typography>
              <Link to="/staking/create">(create)</Link>
            </Box>

            <AirdropTable />

            <Typography variant="body1" margin={'36px 0'}>
              * Changes in the weighted value affect the number of tokens to be claimed.
            </Typography>

            <TextIntr />
          </Box>
        </Container>
      </Main>
    </Box>
  )
}
