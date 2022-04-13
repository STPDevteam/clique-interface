import { useCallback, useMemo } from 'react'
import { useCrossCommitCreateDaoData } from '../state/crossBuilding/hooks'
import { amountAddDecimals } from '../utils/dao'
import { calcVotingDuration } from 'pages/building/function'
import { useDaoFactoryContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTokenByChain } from 'state/wallet/hooks'

export function useCrossGovCreateDaoCallback() {
  const { basicData, ruleData } = useCrossCommitCreateDaoData()
  const daoFactoryContract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const tokenInfo = useTokenByChain(basicData.contractAddress, basicData.baseChainId)
  const token = tokenInfo?.token

  const args = useMemo(() => {
    const _basicParams = {
      daoName: tokenInfo?.token.name,
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
    if (!daoFactoryContract) {
      throw new Error('Unexpected error. Contract error')
    }
    if (!token) {
      console.error('Unexpected error. token error')
    }

    console.log('args->', JSON.stringify(args), ...args)
    return daoFactoryContract.estimateGas.createCrossGovDAO(...args, { from: account }).then(estimatedGasLimit => {
      return daoFactoryContract
        .createCrossGovDAO(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create cross gov Dao'
          })
          return response.hash
        })
    })
  }, [account, addTransaction, args, daoFactoryContract, token])
}
