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
import { Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import NetworkSelect from '../../Header/NetworkSelect'
import { isDaoframeSite } from 'utils/dao'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function Index() {
  const { account } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()

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
            <OutlineButton width={140}>
              <Typography variant="h6" onClick={() => history.push('/my_wallet')}>
                My Wallet
              </Typography>
            </OutlineButton>
          )}
          <OutlineButton
            onClick={toggleWalletModal}
            width={160}
            style={{
              background: '#FAFAFA',
              boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.5)',
              border: 'none'
            }}
          >
            <Typography fontWeight={500} color={'#3898FC'}>
              {shortenAddress(account)}
            </Typography>
          </OutlineButton>
        </Box>
      )}
    </div>
  )
}
