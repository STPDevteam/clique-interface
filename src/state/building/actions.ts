import { createAction } from '@reduxjs/toolkit'

// export interface IHolder {
//   address: string
//   number: number | undefined
//   per: number | undefined
// }

// export interface IMinVote {
//   per: number
//   votes: number
// }

// export interface IPhoto {
//   preview: string
//   file: any
// }

// export interface IVotingDuration {
//   days?: number
//   hours?: number
//   minutes?: number
// }

export interface CreateDaoDataBasic {
  daoName: string
  description: string
  tokenName: string
  tokenSymbol: string
  tokenSupply: string
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
  pledgedOfValue: number | undefined
}
export interface CreateDaoDataDistributionPublicSale {
  offeringAmount: string
  price: number | undefined
  pledgeLimitMin: string | undefined
  pledgeLimitMax: string | undefined
  startTime: number | undefined
  endTime: number | undefined
  aboutProduct: string
}

export interface PrivateReceivingTokenProps {
  name: string
  value: string
  logo: JSX.Element
}

export interface CreateDaoDataDistribution {
  reservedTokens: CreateDaoDataDistributionReservedToken[]
  reservedOpen: boolean
  privateSale: CreateDaoDataDistributionPrivateSale[]
  privateSaleOpen: boolean
  privateReceivingToken: string | undefined
  publicSale: CreateDaoDataDistributionPublicSale
  publicSaleOpen: boolean
}

export interface CreateDaoDataRule {
  minVotePer: number
  minCreateProposalPer: number
  minApprovalPer: number
  days?: number
  hours?: number
  minutes?: number
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
