import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import IconTokenSvg from '../../assets/images/icon-token.svg'
import {
  updateBuildingBasicDao,
  updateBuildingDistributionDao,
  updateBuildingRuleDao,
  removeBuildingDao,
  CreateDaoDataBasic,
  CreateDaoDataDistribution,
  CreateDaoDataRule,
  PrivateReceivingTokenProps
} from './actions'
import BigNumber from 'bignumber.js'
import { calcTotalAmountValue } from 'pages/building/function'

// price decimals 12
export const privateReceivingTokens: PrivateReceivingTokenProps[] = [
  {
    name: 'STEP',
    value: 'STEP',
    chainId: 1,
    logo: IconTokenSvg,
    address: '0x030003546dfF30d0B7F0e6cD284D32A9D273131C',
    decimals: 18
  }
  // {
  //   name: 'USDT',
  //   value: 'USDT',
  //   chainId: 1,
  //   logo: IconTokenSvg,
  //   address: '0xc751F532EE2a6c0D910208aFE2fFfC127652284C',
  //   decimals: 18
  // }
]

export function useBuildingDataCallback() {
  const buildingDaoData = useSelector((state: AppState) => state.buildingDao)

  const dispatch = useDispatch<AppDispatch>()
  const updateBasic = useCallback(
    (createDaoDataBasic: CreateDaoDataBasic) => {
      dispatch(updateBuildingBasicDao({ createDaoDataBasic }))

      if (createDaoDataBasic.tokenSupply !== buildingDaoData.basic.tokenSupply) {
        // reset Distribution token number and per
        const {
          reservedTokens,
          reservedOpen,
          privateSale,
          privateSaleOpen,
          privateReceivingToken,
          publicSale,
          publicSaleOpen,
          startTime,
          endTime,
          aboutProduct
        } = buildingDaoData.distribution
        const _newCreateDaoDataDistribution: CreateDaoDataDistribution = {
          reservedTokens: reservedTokens.map(item =>
            Object.assign({ ...item }, { tokenNumber: undefined, per: undefined })
          ),
          reservedOpen,
          privateSale: privateSale.map(item => Object.assign({ ...item }, { tokenNumber: undefined, per: undefined })),
          privateSaleOpen,
          privateReceivingToken,
          publicSale: Object.assign({ ...publicSale }, { offeringAmount: undefined }),
          publicSaleOpen,
          startTime,
          endTime,
          aboutProduct
        }
        dispatch(updateBuildingDistributionDao({ createDaoDataDistribution: _newCreateDaoDataDistribution }))
      }
    },
    [buildingDaoData.basic.tokenSupply, buildingDaoData.distribution, dispatch]
  )
  const updateDistribution = useCallback(
    (createDaoDataDistribution: CreateDaoDataDistribution) => {
      dispatch(updateBuildingDistributionDao({ createDaoDataDistribution }))
    },
    [dispatch]
  )
  const updateRule = useCallback(
    (createDaoDataRule: CreateDaoDataRule) => {
      dispatch(updateBuildingRuleDao({ createDaoDataRule }))
    },
    [dispatch]
  )
  const removeBuildingDaoData = useCallback(() => {
    dispatch(removeBuildingDao())
  }, [dispatch])

  return {
    updateBasic,
    updateDistribution,
    updateRule,
    removeBuildingDaoData,
    buildingDaoData
  }
}

export function useCurrentUsedTokenAmount() {
  const buildingDaoData = useSelector((state: AppState) => state.buildingDao)
  const { basic, distribution } = buildingDaoData

  let reservedAmountUsed = '0'
  if (distribution.reservedOpen) {
    reservedAmountUsed = distribution.reservedTokens.length
      ? distribution.reservedTokens
          .map(item => item.tokenNumber)
          .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString()) || '0'
      : '0'
  }

  let privateSaleUsed = '0'
  let privateSalePrice = '0'
  if (distribution.privateSaleOpen) {
    privateSaleUsed = distribution.privateSale.length
      ? distribution.privateSale
          .map(item => item.tokenNumber)
          .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString()) || '0'
      : '0'

    privateSalePrice = distribution.privateSale.length
      ? distribution.privateSale
          .map(item => calcTotalAmountValue(item.tokenNumber, item.price))
          .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString())
      : '0'
  }
  const publicSaleUsed = new BigNumber(distribution.publicSale.offeringAmount || '0').toString()

  return {
    reservedAmount: reservedAmountUsed,
    privateSaleTotal: privateSaleUsed,
    privateEquivalentEstimate: privateSalePrice,
    publicSaleTotal: publicSaleUsed,
    publicEquivalentEstimate: calcTotalAmountValue(publicSaleUsed, distribution.publicSale.price) || '0',
    tokenSupply: basic.tokenSupply
  }
}

export function useRemainderTokenAmount(): string {
  const { tokenSupply, reservedAmount, privateSaleTotal, publicSaleTotal } = useCurrentUsedTokenAmount()
  const ret = new BigNumber(tokenSupply || '0')
    .minus(reservedAmount)
    .minus(privateSaleTotal)
    .minus(publicSaleTotal)
  return ret.gt(0) ? ret.toFixed(0) : '0'
}

export function useTrueCommitCreateDaoData() {
  const buildingDaoData = useSelector((state: AppState) => state.buildingDao)
  const { basic, distribution, rule } = buildingDaoData
  const basicData: CreateDaoDataBasic = Object.assign(
    { ...basic },
    {
      daoName: basic.daoName.trim(),
      description: basic.description.trim(),
      tokenName: basic.tokenName.trim(),
      tokenSymbol: basic.tokenSymbol.trim(),
      tokenSupply: basic.tokenSupply.trim(),
      tokenPhoto: basic.tokenPhoto.trim(),
      websiteLink: basic.websiteLink.trim(),
      twitterLink: basic.twitterLink.trim(),
      discordLink: basic.discordLink.trim()
    }
  )
  const distributionData: CreateDaoDataDistribution = Object.assign(
    { ...distribution },
    { aboutProduct: distribution.aboutProduct.trim() }
  )
  const ruleData: CreateDaoDataRule = Object.assign({ ...rule }, { rules: rule.rules.trim() })

  return {
    basicData,
    distributionData,
    ruleData
  }
}

export function useCurrentReceivingToken() {
  const { distributionData } = useTrueCommitCreateDaoData()
  for (const item of privateReceivingTokens) {
    if (distributionData.privateReceivingToken === item.value) return item
  }
  return privateReceivingTokens[0]
}
