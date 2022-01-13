import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract } from './useContract'

export function useCancelProposalCallback(votingAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()

  return useCallback(
    (id: string) => {
      if (!account) throw new Error('none account')
      if (!votingContract) throw new Error('none votingContract')

      return votingContract.estimateGas.cancelProposal(id, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .cancelProposal(id, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Cancel Proposal'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, votingContract]
  )
}
