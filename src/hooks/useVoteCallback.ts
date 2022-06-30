import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useVotingContract, useCrossVotingContract } from './useContract'
import { CrossSigType } from './useCreateCommunityProposalCallback'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useVoteCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (id: string, index: number) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress) throw new Error('none votingContract')

      const args = [id, index]
      const method = 'vote'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)

      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
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
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useVoteCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, addTransaction, gasPriceInfoCallback, tagKey, votingAddress, votingContract]
  )
}

export function useCrossVoteCallback(votingAddress: string | undefined, tagKey: string) {
  const addTransaction = useTransactionAdder()
  const votingContract = useCrossVotingContract(votingAddress)
  const gasPriceInfoCallback = useGasPriceInfo()
  const { account } = useActiveWeb3React()

  return useCallback(
    async (
      voteInfo: { id: string; index: number },
      user: string,
      weight: string,
      chainId: number,
      voting: string,
      nonce: number,
      signature: string
    ) => {
      if (!account) throw new Error('none account')
      if (!votingContract || !votingAddress) throw new Error('none votingContract')

      const args = [...Object.values(voteInfo), [user, weight, chainId, voting, nonce, CrossSigType.Vote], signature]

      const method = 'vote'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)
      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
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
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCrossVoteCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, addTransaction, gasPriceInfoCallback, tagKey, votingAddress, votingContract]
  )
}
