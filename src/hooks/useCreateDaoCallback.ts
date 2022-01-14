import { useCallback, useMemo } from 'react'
import { Token } from '../constants/token'
import { useCurrentReceivingToken, useTrueCommitCreateDaoData } from '../state/building/hooks'
import { amountAddDecimals } from '../utils/dao'
import { tryParseAmount } from '../state/application/hooks'
import { calcVotingDuration } from 'pages/building/function'
import { useDaoFactoryContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { PriceDecimals } from '../constants'

export function useCreateDaoCallback() {
  const { basicData, distributionData, ruleData } = useTrueCommitCreateDaoData()
  const currentReceivingToken = useCurrentReceivingToken()
  const daoFactoryContract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  // special price decimals
  const stptPriceToken = useMemo(
    () => new Token(currentReceivingToken.chainId, currentReceivingToken.address, PriceDecimals),
    [currentReceivingToken]
  )

  const args = useMemo(() => {
    const _basicParams = {
      daoName: basicData.daoName,
      daoDesc: basicData.description,
      website: basicData.websiteLink,
      twitter: basicData.twitterLink,
      discord: basicData.discordLink,
      tokenName: basicData.tokenName,
      tokenSymbol: basicData.tokenSymbol,
      tokenLogo: basicData.tokenPhoto || 'http://img.duoziwang.com/2021/01/1618717228129267.jpg',
      tokenSupply: basicData.tokenSupply,
      tokenDecimal: basicData.tokenDecimals,
      transfersEnabled: true
    }

    let _reserved: any[][] = []
    if (distributionData.reservedOpen) {
      _reserved = distributionData.reservedTokens.map(item => {
        // if (!item.tokenNumber) throw new Error('token number empty')
        return [item.address, amountAddDecimals(item.tokenNumber || '1', basicData.tokenDecimals), item.lockdate]
      })
    }

    let _priSale: any[][] = []
    if (distributionData.privateSaleOpen) {
      _priSale = distributionData.privateSale.map(item => {
        if (!item.tokenNumber) throw new Error('token number empty')
        if (!item.price) throw new Error('token number price empty')
        const _priceTokenAmount = tryParseAmount(item.price.toString(), stptPriceToken)
        if (!_priceTokenAmount) throw new Error('token number price empty')
        return [
          item.address,
          amountAddDecimals(item.tokenNumber, basicData.tokenDecimals),
          _priceTokenAmount.raw.toString()
        ]
      })
    }

    let _pubSale: any[] = []
    if (distributionData.publicSaleOpen) {
      if (!distributionData.publicSale.offeringAmount) throw new Error('offering amount empty')
      if (!distributionData.publicSale.price) throw new Error('publicSale price empty')
      const _priceTokenAmount = tryParseAmount(distributionData.publicSale.price.toString(), stptPriceToken)
      if (!_priceTokenAmount) throw new Error('publicSale price empty')
      const _pubs = {
        amout: amountAddDecimals(distributionData.publicSale.offeringAmount, basicData.tokenDecimals),
        price: _priceTokenAmount.raw.toString(),
        startTime: distributionData.startTime,
        endTime: distributionData.endTime,
        pledgeLimitMin: distributionData.publicSale.pledgeLimitMin
          ? amountAddDecimals(distributionData.publicSale.pledgeLimitMin, basicData.tokenDecimals)
          : 1,
        pledgeLimitMax: distributionData.publicSale.pledgeLimitMax
          ? amountAddDecimals(distributionData.publicSale.pledgeLimitMax, basicData.tokenDecimals)
          : amountAddDecimals(distributionData.publicSale.offeringAmount, basicData.tokenDecimals)
      }
      _pubSale = Object.values(_pubs)
    } else {
      const _pubs = {
        amout: 0,
        price: 0,
        startTime: distributionData.startTime,
        endTime: distributionData.endTime,
        pledgeLimitMin: 0,
        pledgeLimitMax: 0
      }
      _pubSale = Object.values(_pubs)
    }

    const _rule = Object.values({
      minimumVote: amountAddDecimals(ruleData.minVoteNumber, basicData.tokenDecimals),
      minimumCreateProposal: amountAddDecimals(ruleData.minCreateProposalNumber, basicData.tokenDecimals),
      minimumApproval: amountAddDecimals(ruleData.minApprovalNumber, basicData.tokenDecimals),
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

    return [
      Object.values(_basicParams),
      [_reserved, _priSale, _pubSale, currentReceivingToken.address, distributionData.aboutProduct],
      _rule
    ]
  }, [basicData, distributionData, ruleData, stptPriceToken, currentReceivingToken])

  return useCallback(() => {
    if (!daoFactoryContract) {
      throw new Error('Unexpected error. Contract error')
    }

    console.log('args->', JSON.stringify(args), ...args)
    return daoFactoryContract.estimateGas.createDAO(...args, { from: account }).then(estimatedGasLimit => {
      return daoFactoryContract
        .createDAO(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Create Dao'
          })
          return response.hash
        })
    })
  }, [account, addTransaction, args, daoFactoryContract])
}
