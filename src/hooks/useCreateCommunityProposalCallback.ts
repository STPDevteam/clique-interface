import { useCallback } from 'react'
import { useCrossVotingContract, useVotingContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'
// const Web3EthAbi = require('web3-eth-abi')
// Web3EthAbi.encodeFunctionSignature({
//   name: '',
//   type: '',
//   inputs: []
// })

export enum ProposalType {
  COMMUNITY,
  CONTRACT
}
export enum ProposalStatusProp {
  Review,
  Active,
  Failed,
  Success,
  Cancel,
  Executed,
  Executable
}
export const ProposalStatusText: { [key in ProposalStatusProp]: string } = {
  [ProposalStatusProp.Review]: 'Soon',
  [ProposalStatusProp.Active]: 'Active',
  [ProposalStatusProp.Failed]: 'Declined',
  [ProposalStatusProp.Success]: 'Approved',
  [ProposalStatusProp.Cancel]: 'Closed',
  [ProposalStatusProp.Executed]: 'Approved&Executed',
  [ProposalStatusProp.Executable]: 'Approved'
}

interface CreateCommunityProposalContent {
  title: string
  content: string
  startTime: number
  endTime: number
  options: string[]
}

export function useCreateCommunityProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (title: string, content: string, startTime: number, endTime: number, options: string[]) => {
      if (!votingContract) throw new Error('none contract')

      const args = [title, content, startTime, endTime, options]
      const method = 'createCommunityProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)

      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create community proposal'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCreateCommunityProposalCallback',
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
    [account, addTransaction, gasPriceInfoCallback, votingContract]
  )
}

export enum CrossSigType {
  CreateProposal,
  Vote
}
export function useCreateCrossProposalCallback(votingAddress: string | undefined) {
  const votingContract = useCrossVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
      voteInfo: CreateCommunityProposalContent,
      user: string,
      weight: string,
      chainId: number,
      voting: string,
      nonce: number,
      signature: string
    ) => {
      if (!votingContract) throw new Error('none contract')

      const args = [
        ...Object.values(voteInfo),
        [user, weight, chainId, voting, nonce, CrossSigType.CreateProposal],
        signature
      ]
      console.log(
        '🚀 ~ file: useCreateCommunityProposalCallback.ts ~ line 97 ~ useCreateCrossProposalCallback ~ args',
        args,
        JSON.stringify(args)
      )
      const method = 'createCommunityProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)

      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create community proposal'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCreateCrossProposalCallback',
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
    [account, addTransaction, gasPriceInfoCallback, votingContract]
  )
}
