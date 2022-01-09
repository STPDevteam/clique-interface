import { useCallback } from 'react'
import { useVotingContract } from './useContract'
// import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
const Web3EthAbi = require('web3-eth-abi')

export enum ProposalType {
  COMMUNITY,
  CONTRACT
}

export function useCreateCommunityProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (title: string, content: string, startTime: number, endTime: number) => {
      if (!votingContract) throw new Error('none contract')

      const args = [
        0,
        title,
        content,
        startTime,
        endTime,
        Web3EthAbi.encodeFunctionSignature({
          name: '',
          type: '',
          inputs: []
        })
      ]

      // return votingContract.estimateGas.createProposal(...args, { from: account }).then(estimatedGasLimit => {
      return votingContract
        .createProposal(...args, {
          // gasLimit: calculateGasMargin(estimatedGasLimit),
          gasLimit: '3500000',
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create proposal'
          })
          return response.hash
        })
      // })
    },
    [account, addTransaction, votingContract]
  )
}
