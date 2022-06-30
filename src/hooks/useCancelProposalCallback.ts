import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'

export function useCancelProposalCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (id: string) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress) throw new Error('none votingContract')

      const args = [id]
      const method = 'cancelProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)
      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      }).then((response: TransactionResponse) => {
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
    },
    [account, addTransaction, gasPriceInfoCallback, tagKey, votingAddress, votingContract]
  )
}
