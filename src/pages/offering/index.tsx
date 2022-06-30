import { Avatar, Box, Grid, styled, Typography } from '@mui/material'
import { Dots, ExternalLink } from 'theme/components'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as OpenLink } from 'assets/svg/open-link.svg'
import OutlineButton from 'components/Button/OutlineButton'
import { Input, Progress } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DaoTypeStatus, useDaoInfoByAddress, useDaoStatus } from 'hooks/useDAOInfo'
import { getCurrentTimeStamp, timeStampToFormat, toFormatGroup } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'
import { useReservedClaimCallback } from 'hooks/useReservedClaimCallback'
import { usePartPriSaleCallback } from 'hooks/usePartPriSaleCallback'
import { usePartPubSaleCallback } from 'hooks/usePartPubSaleCallback'
import { useReservedClaimed, useIsPriSoldAddress, usePubSoldAmt, usePubSoldAmtPerAddress } from 'hooks/useDaoOffering'
import { ETHER, TokenAmount } from 'constants/token'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { tryParseAmount, useWalletModalToggle } from 'state/application/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import Image from 'components/Image'
import JSBI from 'jsbi'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BigNumber from 'bignumber.js'
import ShowTokenHolders from '../Daos/ShowTokenHolders'
import ActiveBox from './ActiveBox'
import { ReactComponent as IconDao } from 'assets/svg/icon-dao.svg'
import { ZERO_ADDRESS } from '../../constants'
import { useTagCompletedTx } from 'state/transactions/hooks'

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 138,
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  padding: '23px 43px'
})
const StyledTabBox = styled(Box)({
  margin: '10px auto 0',
  display: 'flex',
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

const StyledContent = styled(Box)({
  maxWidth: '1320px',
  padding: '20px 76px 100px'
})
const StyledCard = styled(Box)({
  boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.5)',
  borderRadius: '8px',
  padding: '23px 37px'
})
const StyledBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

type TabOption = 'about' | 'active'
export default function Offering() {
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const toggleWalletModal = useWalletModalToggle()

  const { address: daoAddress } = useParams<{ address: string }>()
  const daoInfo = useDaoInfoByAddress(daoAddress)
  const daoStatus = useDaoStatus(daoInfo)
  const [tabInfo, setTabInfo] = useState<TabOption>('about')
  const pubSoldAmt = usePubSoldAmt(daoInfo?.daoAddress)

  const [publicAmount, setPublicAmount] = useState('')

  const currentAccountPubSoldAmt = usePubSoldAmtPerAddress(daoInfo?.daoAddress, account || undefined)
  const currentAccountPubSoldTokenAmount = useMemo(() => {
    if (!daoInfo?.token || !currentAccountPubSoldAmt) return undefined
    return new TokenAmount(daoInfo.token, JSBI.BigInt(currentAccountPubSoldAmt))
  }, [currentAccountPubSoldAmt, daoInfo?.token])

  const remainingPubSaleAmount = useMemo(() => {
    if (!pubSoldAmt || !daoInfo?.token || !daoInfo.pubSale) return undefined
    const pubSoldTokenAmt = new TokenAmount(daoInfo.token, pubSoldAmt)
    return new TokenAmount(daoInfo.token, daoInfo.pubSale.amount.subtract(pubSoldTokenAmt).numerator.toString())
  }, [daoInfo?.pubSale, daoInfo?.token, pubSoldAmt])

  const currentPublicMaxInput = useMemo(() => {
    if (!daoInfo?.pubSale || !remainingPubSaleAmount || !currentAccountPubSoldTokenAmount) return '0'
    if (daoInfo.pubSale.pledgeLimitMax.greaterThan('0')) {
      const _selfAmount = daoInfo.pubSale.pledgeLimitMax.subtract(currentAccountPubSoldTokenAmount)
      return _selfAmount.greaterThan(remainingPubSaleAmount)
        ? remainingPubSaleAmount.toSignificant()
        : _selfAmount.toSignificant()
    } else {
      return remainingPubSaleAmount.toSignificant()
    }
  }, [currentAccountPubSoldTokenAmount, daoInfo?.pubSale, remainingPubSaleAmount])

  const isPriSaleAccount = useMemo(() => {
    if (!account || !daoInfo) return undefined
    for (const item of daoInfo.priSale) {
      if (item.address === account) return item
    }
    return undefined
  }, [account, daoInfo])

  const priSalePayAmount = useMemo(() => {
    if (!isPriSaleAccount) return undefined
    return new TokenAmount(
      isPriSaleAccount.price.token,
      isPriSaleAccount.price.multiply(JSBI.BigInt(isPriSaleAccount.amount.toSignificant())).numerator.toString()
    )
  }, [isPriSaleAccount])

  const isReservedAccount = useMemo(() => {
    if (!account || !daoInfo) return undefined
    for (const item of daoInfo.reserved) {
      if (item.address === account) {
        const curTimeStamp = getCurrentTimeStamp()
        return {
          ...item,
          isLocked: item.lockDate > curTimeStamp ? true : false
        }
      }
    }
    return undefined
  }, [account, daoInfo])

  const isReservedClaimed = useReservedClaimed(daoInfo?.daoAddress, account || undefined)
  const isPriSoldAddress = useIsPriSoldAddress(daoInfo?.daoAddress, account || undefined)

  const pubPriSaleIsOpen = useMemo(() => {
    if (!daoInfo?.pubSale) return false
    const curTimeStamp = getCurrentTimeStamp()
    return daoInfo.pubSale.startTime < curTimeStamp && curTimeStamp < daoInfo.pubSale.endTime
  }, [daoInfo?.pubSale])

  const currentPubReceiveTokenAmount = useMemo(() => {
    if (!JSBI.GT(JSBI.BigInt(publicAmount), JSBI.BigInt(0))) {
      return undefined
    }
    if (!daoInfo?.pubSale?.price) return undefined
    const _val = daoInfo.pubSale.price.multiply(publicAmount)
    return new TokenAmount(daoInfo.pubSale.price.token, _val.numerator.toString())
  }, [daoInfo?.pubSale?.price, publicAmount])

  const [priSaleApprovalState, priSaleApprovalCallback] = useApproveCallback(priSalePayAmount, daoInfo?.daoAddress)
  const [pubSaleApprovalState, pubSaleApprovalCallback] = useApproveCallback(
    currentPubReceiveTokenAmount,
    daoInfo?.daoAddress
  )
  const receiveTokenIsEther = useMemo(() => (daoInfo?.receiveToken?.address === ZERO_ADDRESS ? true : false), [
    daoInfo?.receiveToken
  ])

  const reservedClaimCallback = useReservedClaimCallback(daoInfo?.daoAddress)
  const partPriSaleCallback = usePartPriSaleCallback(daoInfo?.daoAddress)
  const partPubSaleCallback = usePartPubSaleCallback(daoInfo?.daoAddress)

  const isReserving = useTagCompletedTx('claimReserved', '', daoInfo?.daoAddress)

  const publicCurrencyAmount = useMemo(() => tryParseAmount(publicAmount, daoInfo?.token), [
    daoInfo?.token,
    publicAmount
  ])

  const onPartPubSaleCallback = useCallback(() => {
    if (!publicCurrencyAmount || !publicCurrencyAmount.greaterThan('0')) {
      return
    }
    if (!currentPubReceiveTokenAmount) return
    showModal(<TransactionPendingModal />)
    partPubSaleCallback(
      receiveTokenIsEther,
      currentPubReceiveTokenAmount.raw.toString(),
      publicCurrencyAmount.raw.toString()
    )
      .then(() => {
        hideModal()
        setPublicAmount('')
        showModal(<TransactionSubmittedModal />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [
    currentPubReceiveTokenAmount,
    publicCurrencyAmount,
    hideModal,
    partPubSaleCallback,
    receiveTokenIsEther,
    showModal
  ])

  const onPartPriSaleCallback = useCallback(() => {
    if (!priSalePayAmount) return
    showModal(<TransactionPendingModal />)
    partPriSaleCallback(receiveTokenIsEther, priSalePayAmount.raw.toString())
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, partPriSaleCallback, priSalePayAmount, receiveTokenIsEther, showModal])

  const onReservedClaim = useCallback(() => {
    showModal(<TransactionPendingModal />)
    reservedClaimCallback()
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err, JSON.stringify(err))
      })
  }, [hideModal, reservedClaimCallback, showModal])

  const payBalance = useCurrencyBalance(account || undefined, daoInfo?.receiveToken)
  const ethBalance = useCurrencyBalance(account || undefined, ETHER)

  const getPriSaleActions = useMemo(() => {
    if (!account) {
      return (
        <OutlineButton onClick={toggleWalletModal} primary>
          Connect Wallet
        </OutlineButton>
      )
    }
    if (isPriSoldAddress === undefined) {
      return (
        <OutlineButton disabled>
          Loading
          <Dots />
        </OutlineButton>
      )
    }
    if (isPriSoldAddress) {
      return <OutlineButton disabled>Claimed</OutlineButton>
    }

    if (!pubPriSaleIsOpen) {
      return <OutlineButton disabled>Not open hours</OutlineButton>
    }

    if (receiveTokenIsEther) {
      if (!ethBalance || !priSalePayAmount || ethBalance.lessThan(priSalePayAmount)) {
        return <OutlineButton disabled>Balance Insufficient</OutlineButton>
      }
    } else {
      if (!payBalance || !priSalePayAmount || payBalance.lessThan(priSalePayAmount)) {
        return <OutlineButton disabled>Balance Insufficient</OutlineButton>
      }
      if (priSaleApprovalState !== ApprovalState.APPROVED) {
        if (priSaleApprovalState === ApprovalState.PENDING) {
          return (
            <OutlineButton disabled>
              Approval
              <Dots />
            </OutlineButton>
          )
        } else if (priSaleApprovalState === ApprovalState.NOT_APPROVED) {
          return <OutlineButton onClick={priSaleApprovalCallback}>Approval</OutlineButton>
        } else {
          return <OutlineButton disabled>Pay</OutlineButton>
        }
      }
    }

    return <OutlineButton onClick={onPartPriSaleCallback}>Pay</OutlineButton>
  }, [
    account,
    receiveTokenIsEther,
    ethBalance,
    isPriSoldAddress,
    onPartPriSaleCallback,
    payBalance,
    priSaleApprovalCallback,
    priSaleApprovalState,
    priSalePayAmount,
    pubPriSaleIsOpen,
    toggleWalletModal
  ])

  const getPubSaleActions = useMemo(() => {
    if (!account) {
      return (
        <OutlineButton onClick={toggleWalletModal} primary>
          Connect Wallet
        </OutlineButton>
      )
    }
    if (!pubPriSaleIsOpen) {
      return <OutlineButton disabled>Not open hours</OutlineButton>
    }
    if (!currentPubReceiveTokenAmount) return <OutlineButton disabled>Pay</OutlineButton>

    if (!daoInfo?.pubSale || !publicCurrencyAmount) return null
    if (
      daoInfo.pubSale.pledgeLimitMin.greaterThan('0') &&
      daoInfo.pubSale.pledgeLimitMin.greaterThan(publicCurrencyAmount)
    ) {
      return <OutlineButton disabled>Amount is too small</OutlineButton>
    }

    if (receiveTokenIsEther) {
      if (!ethBalance || ethBalance.lessThan(currentPubReceiveTokenAmount)) {
        return <OutlineButton disabled>Balance Insufficient</OutlineButton>
      }
    } else {
      if (!payBalance || payBalance.lessThan(currentPubReceiveTokenAmount)) {
        return <OutlineButton disabled>Balance Insufficient</OutlineButton>
      }
      if (pubSaleApprovalState !== ApprovalState.APPROVED) {
        if (pubSaleApprovalState === ApprovalState.PENDING) {
          return (
            <OutlineButton disabled>
              Approval
              <Dots />
            </OutlineButton>
          )
        } else if (pubSaleApprovalState === ApprovalState.NOT_APPROVED) {
          return <OutlineButton onClick={pubSaleApprovalCallback}>Approval</OutlineButton>
        } else {
          return <OutlineButton disabled>Pay</OutlineButton>
        }
      }
    }

    if (new BigNumber(currentPublicMaxInput).lt(0.1)) {
      return <OutlineButton disabled>Sale Ended</OutlineButton>
    }
    return <OutlineButton onClick={onPartPubSaleCallback}>Pay</OutlineButton>
  }, [
    account,
    pubPriSaleIsOpen,
    currentPubReceiveTokenAmount,
    daoInfo?.pubSale,
    publicCurrencyAmount,
    receiveTokenIsEther,
    currentPublicMaxInput,
    onPartPubSaleCallback,
    toggleWalletModal,
    ethBalance,
    payBalance,
    pubSaleApprovalState,
    pubSaleApprovalCallback
  ])

  const getReservedActions = useMemo(() => {
    if (!account) {
      return (
        <OutlineButton onClick={toggleWalletModal} primary>
          Connect Wallet
        </OutlineButton>
      )
    }
    if (isReservedClaimed === undefined) {
      return (
        <OutlineButton disabled>
          Loading
          <Dots />
        </OutlineButton>
      )
    }
    if (isReservedClaimed) {
      return <OutlineButton disabled>Claimed</OutlineButton>
    }
    if (isReserving) {
      return (
        <OutlineButton disabled>
          Claiming
          <Dots />
        </OutlineButton>
      )
    }
    if (!isReservedAccount || isReservedAccount.isLocked) {
      return <OutlineButton disabled>Lock time</OutlineButton>
    }

    return <OutlineButton onClick={onReservedClaim}>Claim</OutlineButton>
  }, [account, isReservedAccount, isReservedClaimed, isReserving, onReservedClaim, toggleWalletModal])

  return (
    <div>
      <StyledHeader>
        <Typography variant="h5" mb={14}>
          {daoInfo?.daoName || '-'}
        </Typography>
        <Box display={'flex'} gap="15px" alignItems={'center'}>
          <Typography fontSize={16}>
            <ShowTokenHolders address={daoInfo?.token?.address} /> Members
          </Typography>
          {daoInfo?.link.website && <ExternalLink href={daoInfo.link.website}>{daoInfo.link.website}</ExternalLink>}
          {daoInfo?.link.twitter && (
            <ExternalLink href={daoInfo.link.twitter} sx={{ display: 'flex', alignItems: 'center' }}>
              <Twitter />
            </ExternalLink>
          )}
          {daoInfo?.link.discord && (
            <ExternalLink href={daoInfo.link.discord} sx={{ display: 'flex', alignItems: 'center' }}>
              <Discord />
            </ExternalLink>
          )}
        </Box>
        <Typography fontSize={16} mt={8}>
          {daoInfo?.daoDesc}
        </Typography>
      </StyledHeader>
      <StyledContent>
        <Box mb={32}>
          <OutlineButton width="120px" height={48} onClick={() => history.goBack()}>
            Back
          </OutlineButton>
        </Box>
        <Grid container spacing={32} fontSize={16}>
          <Grid item lg={8} xs={12} width={'100%'}>
            <StyledBetween alignItems={'center'}>
              <Box display={'flex'} gap={15}>
                <Avatar sx={{ width: 58, height: 58 }} src={daoInfo?.logo}>
                  <IconDao />
                </Avatar>
                <Box padding={'4px 0'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                  <Typography variant="h6">{daoInfo?.daoName || '-'}</Typography>
                  <Typography variant="inherit" color={'#767676'}>
                    {daoInfo?.token?.symbol || '-'}
                  </Typography>
                </Box>
              </Box>
              <ExternalLink
                target="self"
                href={`/#/detail/${daoInfo?.daoAddress}`}
                sx={{
                  display: 'flex'
                }}
              >
                View info <OpenLink />
              </ExternalLink>
            </StyledBetween>
            <Box display={'grid'} gap={10} mt={32}>
              <StyledBetween>
                <Typography variant="inherit" color={'#767676'}>
                  Contract Address:
                </Typography>
                <Typography variant="h6">{daoInfo?.token?.address || '-'}</Typography>
              </StyledBetween>
              <StyledBetween>
                <Typography variant="inherit" color={'#767676'}>
                  Target amount:
                </Typography>
                <Typography variant="h6">
                  {daoInfo?.pubSale?.amount ? daoInfo.pubSale.amount.toSignificant(6, { groupSeparator: ',' }) : '-'}
                </Typography>
              </StyledBetween>
              {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC && (
                <>
                  <Progress percent={daoStatus ? Number(daoStatus.pubSoldPer.toFixed(2)) : 0} />
                  <Typography variant="h6">
                    {daoInfo?.pubSoldAmt ? daoInfo.pubSoldAmt.toSignificant(6, { groupSeparator: ',' }) : '-'} /{' '}
                    {daoInfo?.pubSale?.amount ? daoInfo.pubSale.amount.toSignificant(6, { groupSeparator: ',' }) : '-'}{' '}
                  </Typography>
                  <StyledBetween mt={10}>
                    <Box>
                      <Typography variant="inherit" color={'#767676'}>
                        Members
                      </Typography>
                      <ShowTokenHolders address={daoInfo?.token?.address} />
                    </Box>
                    <Box textAlign={'right'}>
                      <Typography variant="inherit" color={'#767676'}>
                        Closed at
                      </Typography>
                      <Typography variant="h6">
                        {daoInfo?.pubSale?.endTime ? timeStampToFormat(daoInfo?.pubSale?.endTime) : '-'}
                      </Typography>
                    </Box>
                  </StyledBetween>
                </>
              )}
              <StyledTabBox display={'flex'}>
                <div className={`item ${tabInfo === 'about' ? 'active' : ''}`} onClick={() => setTabInfo('about')}>
                  About
                </div>
                <div className={`item ${tabInfo === 'active' ? 'active' : ''}`} onClick={() => setTabInfo('active')}>
                  Activity
                </div>
              </StyledTabBox>
              {tabInfo === 'about' && <Typography>{daoInfo?.introduction}</Typography>}
              {tabInfo === 'active' && daoInfo?.token && (
                <ActiveBox daoToken={daoInfo.token} daoAddress={daoInfo?.daoAddress}></ActiveBox>
              )}
            </Box>
          </Grid>
          <Grid item lg={4} xs={12}>
            <Box display={'grid'} gap={24}>
              {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC && (
                <StyledCard display={'grid'} gap={6}>
                  <Typography variant="h6" mb={10}>
                    Public sale
                  </Typography>
                  <StyledBetween>
                    <Typography variant="body1">Funding target</Typography>
                    <Typography variant="h6">
                      {daoInfo?.pubSale?.amount ? toFormatGroup(daoInfo.pubSale.amount.toSignificant()) : ' - '}{' '}
                      {daoInfo?.token?.symbol}
                    </Typography>
                  </StyledBetween>
                  <StyledBetween>
                    <Typography variant="body1">Rate</Typography>
                    <Typography variant="h6">
                      1 {daoInfo?.token?.symbol} = {daoInfo?.pubSale?.price.toSignificant()}{' '}
                      {daoInfo?.pubSale?.price.token.symbol}
                    </Typography>
                  </StyledBetween>
                  <StyledBetween>
                    <Typography variant="body1">Pledge limit</Typography>
                    <Typography variant="body1">
                      {daoInfo?.pubSale?.pledgeLimitMin.greaterThan(JSBI.BigInt(1))
                        ? daoInfo?.pubSale?.pledgeLimitMin.toSignificant(6, { groupSeparator: ',' })
                        : '1'}
                      {' - '}
                      {daoInfo?.pubSale?.pledgeLimitMax.greaterThan(JSBI.BigInt(1))
                        ? daoInfo?.pubSale?.pledgeLimitMax.toSignificant(6, { groupSeparator: ',' })
                        : ''}
                    </Typography>
                  </StyledBetween>
                  <Box>
                    <Typography variant="body1">Pledge amount</Typography>
                    <Input
                      className="input-common"
                      placeholder="1"
                      maxLength={10}
                      value={publicAmount}
                      suffix={
                        <Box display={'flex'} alignItems={'center'} gap={5}>
                          <Image
                            width={24}
                            height={24}
                            style={{ borderRadius: '50%' }}
                            src={daoInfo?.token?.logo || ''}
                          />
                          {daoInfo?.token?.symbol}
                        </Box>
                      }
                      onChange={e => {
                        const _val = e.target.value
                        if (isNaN(Number(_val))) return
                        const reg = new RegExp('^[0-9]*$')
                        if (reg.test(_val)) {
                          if (new BigNumber(_val).gt(currentPublicMaxInput)) {
                            setPublicAmount(currentPublicMaxInput)
                          } else {
                            setPublicAmount(_val)
                          }
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <StyledBetween>
                      <Typography variant="body1">Pay</Typography>
                      <Typography variant="body1">
                        Balance:{' '}
                        {receiveTokenIsEther
                          ? ethBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'
                          : payBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'}{' '}
                        {daoInfo?.receiveToken?.symbol}
                      </Typography>
                    </StyledBetween>
                    <Input
                      className="input-common"
                      maxLength={10}
                      readOnly
                      value={currentPubReceiveTokenAmount?.toSignificant() || ''}
                      suffix={
                        <Box display={'flex'} alignItems={'center'} gap={5}>
                          <Image
                            width={24}
                            height={24}
                            style={{ borderRadius: '50%' }}
                            src={daoInfo?.receiveToken?.logo || ''}
                          />
                          {daoInfo?.receiveToken?.symbol}
                        </Box>
                      }
                    />
                  </Box>
                  <Typography variant="body1">
                    Claimable amount: {toFormatGroup(currentPublicMaxInput)} {daoInfo?.token?.symbol}
                  </Typography>
                  <Typography variant="body1" fontSize={10} mt={10}>
                    *You should do your own research and understand the risks before committing you funds.
                  </Typography>
                  {getPubSaleActions}
                </StyledCard>
              )}

              {isPriSaleAccount && (
                <StyledCard display={'grid'} gap={6}>
                  <Typography variant="h6" mb={10}>
                    Whitelist sale
                  </Typography>
                  <StyledBetween>
                    <Typography variant="body1">Your allocation</Typography>
                    <Typography variant="h6">
                      {isPriSaleAccount ? isPriSaleAccount?.amount.toSignificant(6, { groupSeparator: ',' }) : ''}{' '}
                      {isPriSaleAccount?.amount.token.symbol}
                    </Typography>
                  </StyledBetween>
                  <StyledBetween>
                    <Typography variant="body1">Rate</Typography>
                    <Typography variant="h6">
                      1 {isPriSaleAccount.amount.token.symbol} = {isPriSaleAccount.price.toSignificant()}{' '}
                      {isPriSaleAccount.price.token.symbol}
                    </Typography>
                  </StyledBetween>
                  <StyledBetween>
                    <Typography variant="body1">You pay</Typography>
                    <Typography variant="h6">
                      {priSalePayAmount ? priSalePayAmount.toSignificant(6, { groupSeparator: ',' }) : '-'}{' '}
                      {isPriSaleAccount.price.token.symbol}
                    </Typography>
                  </StyledBetween>
                  <Box mt={10}>{getPriSaleActions}</Box>
                </StyledCard>
              )}
              {!!daoInfo?.priSale.length && !isPriSaleAccount && (
                <StyledCard display={'grid'} gap={6}>
                  <Typography variant="h6" mb={10}>
                    Whitelist sale
                  </Typography>
                  <Typography color={'#FF5F5B'} variant="body1">
                    Your address is not whitelisted
                  </Typography>
                </StyledCard>
              )}

              {!!isReservedAccount && (
                <StyledCard display={'grid'} gap={6}>
                  <Typography variant="h6" mb={10}>
                    Reserved token
                  </Typography>
                  <StyledBetween>
                    <Typography variant="body1">Allocation</Typography>
                    <Typography variant="h6">
                      {isReservedAccount ? toFormatGroup(isReservedAccount?.amount.toSignificant()) : ''}{' '}
                      {isReservedAccount?.amount.token.symbol}
                    </Typography>
                  </StyledBetween>
                  <StyledBetween>
                    <Typography variant="body1">lockDate</Typography>
                    <Typography variant="h6">
                      {isReservedAccount ? timeStampToFormat(isReservedAccount?.lockDate) : '-'}
                    </Typography>
                  </StyledBetween>
                  <Box mt={10}>{getReservedActions}</Box>
                </StyledCard>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledContent>
    </div>
  )
}
