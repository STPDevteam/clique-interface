import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract } from './useContract'

export function useVoteCallback(votingAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()

  return useCallback(
    (id: string, index: number) => {
      if (!account) throw new Error('none account')
      if (!votingContract) throw new Error('none votingContract')

      return votingContract.estimateGas.vote(id, index, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .vote(id, index, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Vote'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, votingContract]
  )
}
