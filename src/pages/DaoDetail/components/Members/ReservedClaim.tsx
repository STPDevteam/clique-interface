import { Box, Typography } from '@mui/material'
import { Alert } from 'antd'
import { useActiveWeb3React } from 'hooks'
import { useDaoInfoByAddress } from 'hooks/useDAOInfo'
import { useReservedClaimed } from 'hooks/useDaoOffering'
import { useCallback, useMemo } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { Dots } from 'theme/components'
import { getCurrentTimeStamp, timeStampToFormat } from 'utils/dao'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useReservedClaimCallback } from 'hooks/useReservedClaimCallback'
import Button from 'components/Button/Button'

export default function ReservedClaim({ daoAddress }: { daoAddress?: string }) {
  const daoInfo = useDaoInfoByAddress(daoAddress)
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()
  const reservedClaimCallback = useReservedClaimCallback(daoInfo?.daoAddress)

  const { account } = useActiveWeb3React()
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
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err, JSON.stringify(err))
      })
  }, [hideModal, reservedClaimCallback, showModal])

  const isReservedClaimed = useReservedClaimed(daoInfo?.daoAddress, account || undefined)

  const getReservedActions = useMemo(() => {
    if (!account) {
      return (
        <Button width="100px" height="40px" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      )
    }
    if (isReservedClaimed === undefined) {
      return (
        <Button width="100px" height="40px" disabled>
          Loading
          <Dots />
        </Button>
      )
    }
    if (isReservedClaimed) {
      return (
        <Button width="100px" height="40px" disabled>
          Claimed
        </Button>
      )
    }
    if (!isReservedAccount || isReservedAccount.isLocked) {
      return (
        <Button width="100px" height="40px" disabled>
          Claim
        </Button>
      )
    }

    return (
      <Button width="100px" height="40px" onClick={onReservedClaim}>
        Claim
      </Button>
    )
  }, [account, isReservedAccount, isReservedClaimed, onReservedClaim, toggleWalletModal])

  if (!isReservedAccount) return null
  return (
    <Alert
      style={{ marginTop: '10px' }}
      message={
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography style={{ marginTop: 0 }}>
            You have{' '}
            <b>
              {isReservedAccount.amount.toSignificant(6, { groupSeparator: ',' })}{' '}
              {isReservedAccount.amount.token.symbol}
            </b>{' '}
            available for claim on {timeStampToFormat(isReservedAccount.lockDate)}
          </Typography>
          {getReservedActions}
        </Box>
      }
    ></Alert>
  )
}
