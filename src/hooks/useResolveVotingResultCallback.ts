import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVotingContract } from './useContract'

export function useResolveVotingResultCallback(votingAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)

  return useCallback(
    (id: string) => {
      if (!votingContract) throw new Error('none votingContract')

      return votingContract.estimateGas.resolveVotingResult(id).then(estimatedGasLimit => {
        return votingContract
          .resolveVotingResult(id, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Resolve voting result'
            })
            return response.hash
          })
      })
    },
    [addTransaction, votingContract]
  )
}
