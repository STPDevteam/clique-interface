import { Box, styled, Typography } from '@mui/material'
import Modal from '../../components/Modal'
import Button from 'components/Button/Button'
import { MyAirdropResProp } from 'hooks/staking/useServerData'
import { timeStampToFormat } from 'utils/dao'
import { tryParseAmount, useWalletModalToggle } from 'state/application/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { Dots } from 'theme/components'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { FARM_STAKING_ADDRESS } from '../../constants'
import { useCreateAirdropCallback } from 'hooks/staking/useCreateAirdropCallback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'

const Item = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between'
})

export default function PublishModal({ item }: { item: MyAirdropResProp }) {
  const { account, chainId } = useActiveWeb3React()
  const airdropAmount = tryParseAmount(item.airdropAmount, item.token)
  const balance = useTokenBalance(account || undefined, item.token)
  const toggleWalletModal = useWalletModalToggle()
  const createAirdropCallback = useCreateAirdropCallback()
  const { showModal } = useModal()

  const curStakeAddress = useMemo(
    () => (chainId && FARM_STAKING_ADDRESS[chainId] ? FARM_STAKING_ADDRESS[chainId] : undefined),
    [chainId]
  )
  const [airdropApprovalState, airdropApprovalCallback] = useApproveCallback(airdropAmount, curStakeAddress)

  const onCreateAirdropCallback = useCallback(() => {
    if (!airdropAmount) return
    createAirdropCallback(item.tokenContractAddress, airdropAmount.raw.toString(), item.airdropTime, item.id)
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
  }, [airdropAmount, createAirdropCallback, item.airdropTime, item.id, item.tokenContractAddress, showModal])

  const btn = useMemo(() => {
    if (!account) {
      return <Button onClick={toggleWalletModal}>Connect Wallet</Button>
    }
    if (account !== item.creatorAddress) {
      return <Button disabled>account error</Button>
    }
    if (!airdropAmount) {
      return <Button disabled>Airdrop amount error</Button>
    }
    if (!balance || balance.lessThan(airdropAmount)) {
      return <Button disabled>Balance Insufficient</Button>
    }

    if (airdropApprovalState !== ApprovalState.APPROVED) {
      if (airdropApprovalState === ApprovalState.PENDING) {
        return (
          <Button disabled>
            Approve
            <Dots />
          </Button>
        )
      } else if (airdropApprovalState === ApprovalState.NOT_APPROVED) {
        return <Button onClick={airdropApprovalCallback}>Approve</Button>
      } else {
        return (
          <Button disabled height="40px" style={{ padding: '0 15px', width: 'auto' }}>
            Loading
          </Button>
        )
      }
    }

    return <Button onClick={onCreateAirdropCallback}>Publish</Button>
  }, [
    account,
    onCreateAirdropCallback,
    airdropAmount,
    airdropApprovalCallback,
    airdropApprovalState,
    balance,
    item.creatorAddress,
    toggleWalletModal
  ])

  return (
    <Modal closeIcon>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Airdrop publish
      </Typography>
      <Box
        margin="20px 0"
        display={'grid'}
        gap="10px"
        sx={{
          background: '#FAFAFA',
          boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
          borderRadius: '8px',
          padding: '15px'
        }}
      >
        <Box>
          <Typography variant="h6">Token Address</Typography>
          <Typography variant="body1">{item.token?.address}</Typography>
        </Box>

        <Item>
          <Typography variant="h6">Amount</Typography>
          <Typography variant="body1">{airdropAmount?.toSignificant(6, { groupSeparator: ',' })}</Typography>
        </Item>

        <Item>
          <Typography variant="h6">Airdrop time(estimate)</Typography>
          <Typography variant="body1">{timeStampToFormat(item.airdropTime)}</Typography>
        </Item>
      </Box>

      {btn}
    </Modal>
  )
}
