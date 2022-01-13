import { useCallback } from 'react'
import { useVotingContract } from './useContract'
// import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
const Web3EthAbi = require('web3-eth-abi')

export function useCreateContractProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const withdrawAssetCallback = useCallback(
    (title: string, content: string, startTime: number, endTime: number, tokenAddress: string, amount: string) => {
      if (!votingContract) throw new Error('none contract')

      const args = [
        title,
        content,
        startTime,
        endTime,
        Web3EthAbi.encodeFunctionSignature({
          name: 'withdrawToken',
          type: 'function',
          inputs: [
            {
              type: 'address',
              name: tokenAddress
            },
            {
              type: 'address',
              name: account
            },
            {
              type: 'uint256',
              name: amount
            }
          ]
        })
      ]

      // return votingContract.estimateGas.createContractProposal(...args, { from: account }).then(estimatedGasLimit => {
      return votingContract
        .createContractProposal(...args, {
          // gasLimit: calculateGasMargin(estimatedGasLimit),
          gasLimit: '3500000',
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create contract proposal'
          })
          return response.hash
        })
      // })
    },
    [account, addTransaction, votingContract]
  )

  return {
    withdrawAssetCallback
  }
}
