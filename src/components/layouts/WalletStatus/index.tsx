import './pc.less'

import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import WalletModal from 'components/Modal/WalletModal'
import { shortenAddress } from 'utils'
import useENSName from 'hooks/useENSName'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { useWalletModalToggle } from 'state/application/hooks'
import Button from 'components/Button/Button'
import OutlineButton from 'components/Button/OutlineButton'
import { Box, Typography, useTheme } from '@mui/material'
import { useHistory } from 'react-router-dom'
import NetworkSelect from '../../Header/NetworkSelect'
import { isDaoframeSite } from 'utils/dao'
// import CreatorModal from './CreatorModal'
// import useModal from 'hooks/useModal'
import Image from 'components/Image'
import { ChainListMap } from 'constants/chain'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function Index() {
  const { account, chainId } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  // const { showModal, hideModal } = useModal()
  const theme = useTheme()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  return (
    <div className="wallet-status">
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      {!account && (
        <Box display={'flex'} gap={20}>
          <NetworkSelect />
          <Button onClick={toggleWalletModal} width="150px">
            Connect Wallet
          </Button>
        </Box>
      )}
      {account && (
        <Box display={'flex'} gap={20}>
          {/* <OutlineButton width={140}>
            <Typography variant="h6" onClick={() => history.push('/staking')}>
              Staking
            </Typography>
          </OutlineButton> */}
          <NetworkSelect />
          {!isDaoframeSite() && (
            <>
              <OutlineButton primary width={140}>
                <Typography variant="h6" onClick={() => history.push('/my_wallet')}>
                  My Wallet
                </Typography>
              </OutlineButton>
            </>
          )}
          <OutlineButton primary onClick={toggleWalletModal} width={160}>
            <Image src={ChainListMap[chainId || 1].logo} style={{ height: 20 }} />
            <Typography
              fontWeight={700}
              sx={{
                fontSize: { xs: 9, sm: 14 },
                color: theme.palette.text.primary
              }}
            >
              {ENSName || shortenAddress(account)}
            </Typography>
          </OutlineButton>
        </Box>
      )}
    </div>
  )
}
