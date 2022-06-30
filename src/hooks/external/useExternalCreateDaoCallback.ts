import { useCallback, useMemo } from 'react'
import { useExternalCommitCreateDaoData } from '../../state/externalBuilding/hooks'
import { amountAddDecimals } from '../../utils/dao'
import { calcVotingDuration } from 'pages/building/function'
import { useDaoFactoryContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useToken } from 'state/wallet/hooks'
import { useGasPriceInfo } from 'hooks/useGasPrice'

export function useExternalCreateDaoCallback() {
  const { basicData, ruleData } = useExternalCommitCreateDaoData()
  const daoFactoryContract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const token = useToken(basicData.contractAddress)

  const args = useMemo(() => {
    const _basicParams = {
      daoName: basicData.daoName,
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

    return [Object.values(_basicParams), _rule, basicData.contractAddress]
  }, [basicData, ruleData, token])

  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(async () => {
    if (!daoFactoryContract) {
      throw new Error('Unexpected error. Contract error')
    }
    if (!token) {
      throw new Error('Unexpected error. token error')
    }

    console.log('args->', JSON.stringify(args), ...args)
    const method = 'createDAOWithExternalToken'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoFactoryContract, method, args)
    return daoFactoryContract[method](...args, {
      gasPrice,
      gasLimit,
      from: account
    }).then((response: TransactionResponse) => {
      addTransaction(response, {
        summary: 'Create external Dao'
      })
      return response.hash
    })
  }, [account, addTransaction, args, daoFactoryContract, gasPriceInfoCallback, token])
}
