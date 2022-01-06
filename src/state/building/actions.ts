import { createAction } from '@reduxjs/toolkit'
export interface CreateDaoDataBasic {
  daoName: string
  description: string
  tokenName: string
  tokenSymbol: string
  tokenSupply: string
  tokenDecimals: number
  tokenPhoto: string
  websiteLink: string
  twitterLink: string
  discordLink: string
}

export interface CreateDaoDataDistributionReservedToken {
  address: string | undefined
  tokenNumber: string | undefined
  per: number | undefined
  lockdate: number | undefined
}
export interface CreateDaoDataDistributionPrivateSale {
  address: string | undefined
  tokenNumber: string | undefined
  per: number | undefined
  price: number | undefined
  // pledgedOfValue: number | undefined
}
export interface CreateDaoDataDistributionPublicSale {
  offeringAmount: string
  price: number | undefined
  pledgeLimitMin: string | undefined
  pledgeLimitMax: string | undefined
}

export interface PrivateReceivingTokenProps {
  name: string
  value: string
  logo: string
  chainId: number
  address: string
  decimals: number
}

export interface CreateDaoDataDistribution {
  reservedTokens: CreateDaoDataDistributionReservedToken[]
  reservedOpen: boolean
  privateSale: CreateDaoDataDistributionPrivateSale[]
  privateSaleOpen: boolean
  privateReceivingToken: string
  publicSale: CreateDaoDataDistributionPublicSale
  publicSaleOpen: boolean
  startTime: number | undefined
  endTime: number | undefined
  aboutProduct: string
}

export interface CreateDaoDataRule {
  minVoteNumber: string
  minCreateProposalNumber: string
  minApprovalNumber: string
  days: number
  hours: number
  minutes: number
  votersCustom: boolean
  contractExecutor: string
  contractDays: number
  contractHours: number
  contractMinutes: number
  rules: string
}

export const updateBuildingBasicDao = createAction<{ createDaoDataBasic: CreateDaoDataBasic }>(
  'building/createDaoDataBasic'
)
export const updateBuildingDistributionDao = createAction<{ createDaoDataDistribution: CreateDaoDataDistribution }>(
  'building/createDaoDataDistribution'
)
export const updateBuildingRuleDao = createAction<{ createDaoDataRule: CreateDaoDataRule }>(
  'building/createDaoDataRule'
)
export const removeBuildingDao = createAction('building/removeBuildingDao')
