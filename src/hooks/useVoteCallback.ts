import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract, useCrossVotingContract } from './useContract'
import { CrossSigType } from './useCreateCommunityProposalCallback'
import { useWeb3Instance } from './useWeb3Instance'

export function useVoteCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()

  return useCallback(
    (id: string, index: number) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress || !web3) throw new Error('none votingContract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .vote(id, index, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Vote',
              tag: {
                type: 'proposalVote',
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

export function useCrossVoteCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useCrossVotingContract(votingAddress)
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()

  return useCallback(
    (
      voteInfo: { id: string; index: number },
      user: string,
      weight: string,
      chainId: number,
      voting: string,
      nonce: number,
      signature: string
    ) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress || !web3) throw new Error('none votingContract')

      const args = [...Object.values(voteInfo), [user, weight, chainId, voting, nonce, CrossSigType.Vote], signature]

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .vote(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Vote',
              tag: {
                type: 'proposalVote',
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
