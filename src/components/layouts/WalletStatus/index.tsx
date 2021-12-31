import './pc.less'

import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import WalletModal from 'components/Modal/WalletModal'
import { shortenAddress } from 'utils'
import useENSName from 'hooks/useENSName'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { useWalletModalToggle } from 'state/application/hooks'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function Index() {
  const { account } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const toggleWalletModal = useWalletModalToggle()

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
        <Button onClick={toggleWalletModal} className="btn-common btn-04 btn-connect">
          Connect Wallet
        </Button>
      )}
      {account && (
        <Button className="btn-common btn-04 btn-connected" onClick={toggleWalletModal}>
          {shortenAddress(account)}
        </Button>
      )}
    </div>
  )
}
