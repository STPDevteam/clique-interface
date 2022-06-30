import { useCallback } from 'react'
import { useCrossVotingContract, useVotingContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import Web3 from 'web3'
import DAO_ABI from '../constants/abis/DAO.json'
import { AbiItem } from 'web3-utils'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

const web3 = new Web3()
const daoContract = new web3.eth.Contract((DAO_ABI as unknown) as AbiItem)

export function useCreateContractProposalCallback(votingAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  const withdrawAssetCallback = useCallback(
    async (title: string, content: string, tokenAddress: string, amount: string) => {
      if (!votingContract) throw new Error('none contract')

      const args = [title, content, daoContract.methods.withdrawToken(tokenAddress, account, amount).encodeABI()]
      const method = 'createContractProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)
      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
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
              'useCreateContractProposalCallback',
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
    [votingContract, account, gasPriceInfoCallback, addTransaction]
  )

  const updateConfigurationCallback = useCallback(
    async (
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
      const method = 'createContractProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)

      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
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
              'useCreateContractProposalCallback',
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

  return {
    withdrawAssetCallback,
    updateConfigurationCallback
  }
}

export function useCreateCrossContractProposalCallback(votingAddress: string | undefined) {
  const votingContract = useCrossVotingContract(votingAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (
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
      console.log(args, JSON.stringify(args))
      const method = 'createContractProposal'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)
      return votingContract[method](...args, {
        gasPrice,
        gasLimit,
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
              'useCreateCrossContractProposalCallback',
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
