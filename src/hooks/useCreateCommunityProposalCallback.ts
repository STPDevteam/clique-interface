import { useCallback } from 'react'
import { useCrossVotingContract, useVotingContract } from './useContract'
import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useWeb3Instance } from './useWeb3Instance'
import { commitErrorMsg } from 'utils/fetch/server'
import ReactGA from 'react-ga4'
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
  [ProposalStatusProp.Active]: 'Open',
  [ProposalStatusProp.Failed]: 'Declined',
  [ProposalStatusProp.Success]: 'Success',
  [ProposalStatusProp.Cancel]: 'Closed',
  [ProposalStatusProp.Executed]: 'Executed',
  [ProposalStatusProp.Executable]: 'Success'
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
  const web3 = useWeb3Instance()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (title: string, content: string, startTime: number, endTime: number, options: string[]) => {
      if (!votingContract || !web3) throw new Error('none contract')

      const args = [title, content, startTime, endTime, options]

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .createCommunityProposal(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Create community proposal'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, votingContract, web3]
  )
}

export enum CrossSigType {
  CreateProposal,
  Vote
}
export function useCreateCrossProposalCallback(votingAddress: string | undefined) {
  const votingContract = useCrossVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (
      voteInfo: CreateCommunityProposalContent,
      user: string,
      weight: string,
      chainId: number,
      voting: string,
      nonce: number,
      signature: string
    ) => {
      if (!votingContract || !web3) throw new Error('none contract')

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

      return web3.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .createCommunityProposal(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
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
                'CreateCrossProposal',
                JSON.stringify(err),
                'useCreateCrossProposalCallback',
                JSON.stringify(args)
              )
              ReactGA.event({
                category: 'catch-useCreateCrossProposalCallback',
                action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
                label: JSON.stringify(args)
              })
            }
            throw err
          })
      })
    },
    [account, addTransaction, votingContract, web3]
  )
}
