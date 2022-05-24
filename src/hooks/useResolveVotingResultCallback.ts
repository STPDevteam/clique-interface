import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVotingContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'

export function useResolveVotingResultCallback(votingAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const web3 = useWeb3Instance()
  const votingContract = useVotingContract(votingAddress)

  return useCallback(
    (id: string) => {
      if (!votingContract || !web3) throw new Error('none votingContract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .resolveVotingResult(id, {
            gasPrice: calculateGasPriceMargin(gasPrice)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Resolve voting result'
            })
            return response.hash
          })
      })
    },
    [addTransaction, votingContract, web3]
  )
}
