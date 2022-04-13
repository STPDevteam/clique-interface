import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract } from './useContract'

export function useCancelProposalCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()

  return useCallback(
    (id: string) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress) throw new Error('none votingContract')

      return votingContract.estimateGas.cancelProposal(id, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .cancelProposal(id, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Cancel proposal',
              tag: {
                type: 'proposalCancel',
                key: tagKey,
                id: votingAddress
              }
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, tagKey, votingAddress, votingContract]
  )
}
