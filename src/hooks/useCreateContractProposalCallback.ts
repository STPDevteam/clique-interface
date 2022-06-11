import { useCallback } from 'react'
import { useCrossVotingContract, useVotingContract } from './useContract'
import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import Web3 from 'web3'
import DAO_ABI from '../constants/abis/DAO.json'
import { AbiItem } from 'web3-utils'
import { useWeb3Instance } from './useWeb3Instance'
import { commitErrorMsg } from 'utils/fetch/server'

const web3 = new Web3()
const daoContract = new web3.eth.Contract((DAO_ABI as unknown) as AbiItem)

export function useCreateContractProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const web3In = useWeb3Instance()
  const addTransaction = useTransactionAdder()

  const withdrawAssetCallback = useCallback(
    (title: string, content: string, tokenAddress: string, amount: string) => {
      if (!votingContract || !web3In) throw new Error('none contract')

      const args = [title, content, daoContract.methods.withdrawToken(tokenAddress, account, amount).encodeABI()]

      return web3In.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .createContractProposal(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
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
    [account, addTransaction, votingContract, web3In]
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
      if (!votingContract || !web3In) throw new Error('none contract')

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

      return web3In.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .createContractProposal(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
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
    [account, addTransaction, votingContract, web3In]
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
  const web3In = useWeb3Instance()

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
      if (!votingContract || !web3In) throw new Error('none contract')

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
        args,
        JSON.stringify(args)
      )

      return web3In.eth.getGasPrice().then(gasPrice => {
        return votingContract
          .createContractProposal(...args, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Create contract proposal'
            })
            return response.hash
          })
          .catch((err: any) => {
            if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
              commitErrorMsg(
                'createCrossContractProposal',
                JSON.stringify(err),
                'useCreateCrossContractProposalCallback',
                JSON.stringify(args)
              )
            }
            throw err
          })
      })
    },
    [account, addTransaction, votingContract, web3In]
  )
}
