import { useCallback, useMemo } from 'react'
import { Token } from '../constants/token'
import { useCurrentReceivingToken, useTrueCommitCreateDaoData, useVotesNumber } from '../state/building/hooks'
import { amountAddDecimals } from '../utils/dao'
import { tryParseAmount } from '../state/application/hooks'
import { calcVotingDuration } from 'pages/building/function'
import { useDaoFactoryContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'

export function useCreateDaoCallback() {
  const { basicData, distributionData, ruleData } = useTrueCommitCreateDaoData()
  const currentReceivingToken = useCurrentReceivingToken()
  const votesNumber = useVotesNumber()
  const daoFactoryContract = useDaoFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const stptToken = useMemo(() => new Token(1, currentReceivingToken.address, currentReceivingToken.decimals), [
    currentReceivingToken
  ])

  const args = useMemo(() => {
    const _basicParams = {
      daoName: basicData.daoName,
      daoDesc: basicData.description,
      tokenName: basicData.tokenName,
      tokenSymbol: basicData.tokenSymbol,
      tokenSupply: amountAddDecimals(basicData.tokenSupply, basicData.tokenDecimals),
      transfersEnabled: true
    }

    let _reserved: any[][] = []
    if (distributionData.reservedOpen) {
      _reserved = distributionData.reservedTokens.map(item => {
        if (!item.tokenNumber) throw new Error('token number empty')
        return [item.address, amountAddDecimals(item.tokenNumber, basicData.tokenDecimals), item.lockdate]
      })
    }

    let _priSale: any[][] = []
    if (distributionData.privateSaleOpen) {
      _priSale = distributionData.privateSale.map(item => {
        if (!item.tokenNumber) throw new Error('token number empty')
        if (!item.price) throw new Error('token number price empty')
        const _priceTokenAmount = tryParseAmount(item.price.toString(), stptToken)
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
      const _priceTokenAmount = tryParseAmount(distributionData.publicSale.price.toString(), stptToken)
      if (!_priceTokenAmount) throw new Error('publicSale price empty')
      const _pubs = {
        amout: distributionData.publicSale.offeringAmount,
        price: _priceTokenAmount.raw.toString(),
        startTime: distributionData.startTime,
        endTime: distributionData.endTime
      }
      _pubSale = Object.values(_pubs)
    } else {
      const _pubs = {
        amout: 0,
        price: 0,
        startTime: distributionData.startTime,
        endTime: distributionData.endTime
      }
      _pubSale = Object.values(_pubs)
    }

    const _rule = Object.values({
      minimumVote: amountAddDecimals(votesNumber.minVoteNumber, basicData.tokenDecimals),
      minimumCreateProposal: amountAddDecimals(votesNumber.minCreateProposalNumber, basicData.tokenDecimals),
      minimumApproval: amountAddDecimals(votesNumber.minApprovalNumber, basicData.tokenDecimals),
      communityVotingDuration: ruleData.votersCustom
        ? 0
        : calcVotingDuration(ruleData.days, ruleData.hours, ruleData.minutes),
      contractVotingDuration: ruleData.votersCustom
        ? calcVotingDuration(ruleData.contractDays, ruleData.contractHours, ruleData.contractMinutes)
        : 0,
      content: ruleData.rules
    })

    return [Object.values(_basicParams), [_reserved, _priSale, _pubSale, currentReceivingToken.address], _rule]
  }, [basicData, distributionData, votesNumber, ruleData, stptToken, currentReceivingToken])

  return useCallback(() => {
    if (!daoFactoryContract) {
      throw new Error('Unexpected error. Contract error')
    }

    console.log('args->', JSON.stringify(args), ...args)
    return daoFactoryContract.estimateGas.createDAO(...args, { from: account }).then(estimatedGasLimit => {
      return daoFactoryContract
        .createDAO(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
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
