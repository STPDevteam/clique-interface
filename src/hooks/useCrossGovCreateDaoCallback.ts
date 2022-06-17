import { useCallback, useMemo } from 'react'
import { useCrossCommitCreateDaoData } from '../state/crossBuilding/hooks'
import { amountAddDecimals } from '../utils/dao'
import { calcVotingDuration } from 'pages/building/function'
import { useDaoFactoryContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTokenByChain } from 'state/wallet/hooks'
import { useWeb3Instance } from './useWeb3Instance'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useCrossGovCreateDaoCallback() {
  const { basicData, ruleData } = useCrossCommitCreateDaoData()
  const daoFactoryContract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const tokenInfo = useTokenByChain(basicData.contractAddress, basicData.baseChainId)
  const token = tokenInfo?.token
  const web3 = useWeb3Instance()

  const args = useMemo(() => {
    const _basicParams = {
      daoName: basicData.daoName || tokenInfo?.token.name,
      chainId: basicData.baseChainId,
      contractAddress: basicData.contractAddress,
      daoDesc: basicData.description,
      website: basicData.websiteLink,
      twitter: basicData.twitterLink,
      discord: basicData.discordLink,
      tokenLogo: basicData.tokenPhoto
    }

    const _rule = Object.values({
      minimumVote: amountAddDecimals(ruleData.minVoteNumber, token?.decimals || 18),
      minimumCreateProposal: amountAddDecimals(ruleData.minCreateProposalNumber, token?.decimals || 18),
      minimumApproval: amountAddDecimals(ruleData.minApprovalNumber, token?.decimals || 18),
      communityVotingDuration: ruleData.votersCustom
        ? 0
        : calcVotingDuration(ruleData.days, ruleData.hours, ruleData.minutes),
      contractVotingDuration: calcVotingDuration(
        ruleData.contractDays,
        ruleData.contractHours,
        ruleData.contractMinutes
      ),
      content: ruleData.rules
    })

    return [Object.values(_basicParams), _rule]
  }, [basicData, ruleData, token?.decimals, tokenInfo?.token.name])

  return useCallback(() => {
    if (!daoFactoryContract || !web3) {
      throw new Error('Unexpected error. Contract error')
    }
    if (!token) {
      console.error('Unexpected error. token error')
    }

    console.log('args->', JSON.stringify(args), ...args)
    return web3.eth.getGasPrice().then(gasPrice => {
      return daoFactoryContract
        .createCrossGovDAO(...args, {
          // gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          gasPrice: calculateGasPriceMargin(gasPrice),
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Cross chain DAO created'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'CrossGovCreateDao',
              JSON.stringify(err),
              'useCrossGovCreateDaoCallback',
              JSON.stringify(args)
            )
            ReactGA.event({
              category: 'catch-useCrossGovCreateDaoCallback',
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    })
  }, [account, addTransaction, args, daoFactoryContract, token, web3])
}
