import { useCallback } from 'react'
import { useVotingContract } from './useContract'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import Web3 from 'web3'
import DAO_ABI from '../constants/abis/DAO.json'
import { AbiItem } from 'web3-utils'

const web3 = new Web3()
const daoContract = new web3.eth.Contract((DAO_ABI as unknown) as AbiItem)

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
        daoContract.methods.withdrawToken(tokenAddress, account, amount).encodeABI()
      ]

      return votingContract.estimateGas.createContractProposal(...args, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .createContractProposal(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Create contract proposal'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, votingContract]
  )

  const updateConfigurationCallback = useCallback(
    (
      title: string,
      content: string,
      startTime: number,
      endTime: number,
      minimumVote: string,
      minimumCreateProposal: string,
      minimumValidVotes: string,
      communityVotingDuration: number,
      contractVotingDuration: number,
      descContent: string
    ) => {
      if (!votingContract) throw new Error('none contract')

      const args = [
        title,
        content,
        startTime,
        endTime,
        daoContract.methods
          .updateDaoRule([
            minimumVote,
            minimumCreateProposal,
            minimumValidVotes,
            communityVotingDuration,
            contractVotingDuration,
            descContent
          ])
          .encodeABI()
      ]

      return votingContract.estimateGas.createContractProposal(...args, { from: account }).then(estimatedGasLimit => {
        return votingContract
          .createContractProposal(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Create contract proposal'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, votingContract]
  )

  return {
    withdrawAssetCallback,
    updateConfigurationCallback
  }
}
