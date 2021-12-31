import { createReducer } from '@reduxjs/toolkit'
import {
  updateBuildingBasicDao,
  updateBuildingDistributionDao,
  updateBuildingRuleDao,
  removeBuildingDao,
  CreateDaoDataBasic,
  CreateDaoDataDistribution,
  CreateDaoDataRule
} from './actions'

export interface CreateDaoData {
  basic: CreateDaoDataBasic
  distribution: CreateDaoDataDistribution
  rule: CreateDaoDataRule
}

export const initialDaoDataState: CreateDaoData = {
  basic: {
    daoName: '',
    description: '',
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    tokenPhoto: '',
    websiteLink: '',
    twitterLink: '',
    discordLink: ''
  },
  distribution: {
    reservedTokens: [],
    reservedOpen: false,
    privateSale: [],
    privateSaleOpen: false,
    privateReceivingToken: undefined,
    publicSale: {
      offeringAmount: '',
      price: undefined,
      pledgeLimitMin: undefined,
      pledgeLimitMax: undefined,
      startTime: undefined,
      endTime: undefined,
      aboutProduct: ''
    },
    publicSaleOpen: false
  },
  rule: {
    minVotePer: 0,
    minCreateProposalPer: 0,
    minApprovalPer: 0,
    rules: ''
  }
}

export default createReducer(initialDaoDataState, builder =>
  builder
    .addCase(removeBuildingDao, state => {
      state.basic = initialDaoDataState.basic
      state.distribution = initialDaoDataState.distribution
      state.rule = initialDaoDataState.rule
    })
    .addCase(updateBuildingBasicDao, (state, { payload }) => {
      state.basic = {
        ...state.basic,
        ...payload.createDaoDataBasic
      }
    })
    .addCase(updateBuildingDistributionDao, (state, { payload }) => {
      state.distribution = {
        ...state.distribution,
        ...payload.createDaoDataDistribution
      }
    })
    .addCase(updateBuildingRuleDao, (state, { payload }) => {
      state.rule = {
        ...state.rule,
        ...payload.createDaoDataRule
      }
    })
)
