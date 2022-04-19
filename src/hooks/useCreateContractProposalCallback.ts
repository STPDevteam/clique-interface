import { useCallback } from 'react'
import { useCrossVotingContract, useVotingContract } from './useContract'
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
    (title: string, content: string, tokenAddress: string, amount: string) => {
      if (!votingContract) throw new Error('none contract')

      const args = [title, content, daoContract.methods.withdrawToken(tokenAddress, account, amount).encodeABI()]

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

export function useCreateCrossContractProposalCallback(votingAddress: string | undefined) {
  const votingContract = useCrossVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  return useCallback(
    (
      title: string,
      content: string,
      minimumVote: string,
      minimumCreateProposal: string,
      minimumValidVotes: string,
      communityVotingDuration: number,
      contractVotingDuration: number,
      descContent: string,
      signData: {
        user: string
        weight: string
        chainId: number
        voting: string
        nonce: number
      },
      signature: string
    ) => {
      if (!votingContract) throw new Error('none contract')

      const args = [
        title,
        content,
        [...Object.values(signData), '0'],
        signature,
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
      console.log(
        '🚀 ~ file: useCreateContractProposalCallback.ts ~ line 137 ~ useCreateCrossContractProposalCallback ~ args',
        args
      )

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
}
