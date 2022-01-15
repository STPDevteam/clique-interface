import { useCallback } from 'react'
import { useVotingContract } from './useContract'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
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
  WaitFinish,
  Executable
}
export const ProposalStatusText: { [key in ProposalStatusProp]: string } = {
  [ProposalStatusProp.Review]: 'Review',
  [ProposalStatusProp.Active]: 'Active',
  [ProposalStatusProp.Failed]: 'Failed',
  [ProposalStatusProp.Success]: 'Success',
  [ProposalStatusProp.Cancel]: 'Cancel',
  [ProposalStatusProp.Executed]: 'Executed',
  [ProposalStatusProp.Executable]: 'Executable',
  [ProposalStatusProp.WaitFinish]: 'WaitFinish'
}

export function useCreateCommunityProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (title: string, content: string, startTime: number, endTime: number, options: string[]) => {
      if (!votingContract) throw new Error('none contract')

      const args = [title, content, startTime, endTime, options]

      return votingContract.estimateGas.createCommunityProposal(...args, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .createCommunityProposal(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
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
    [account, addTransaction, votingContract]
  )
}
