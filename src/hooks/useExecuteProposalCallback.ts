import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'

export function useExecuteProposalCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()

  return useCallback(
    (id: string) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress || !web3) throw new Error('none votingContract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .executeProposal(id, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Execute proposal',
              tag: {
                type: 'proposalExec',
                key: tagKey,
                id: votingAddress
              }
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, tagKey, votingAddress, votingContract, web3]
  )
}
