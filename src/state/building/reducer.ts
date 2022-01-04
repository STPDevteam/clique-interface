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
    tokenDecimals: 18,
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
    privateReceivingToken: 'STEP',
    publicSale: {
      offeringAmount: '',
      price: undefined,
      pledgeLimitMin: undefined,
      pledgeLimitMax: undefined
    },
    publicSaleOpen: false,
    startTime: undefined,
    endTime: undefined,
    aboutProduct: ''
  },
  rule: {
    minVotePer: 0,
    minCreateProposalPer: 0,
    minApprovalPer: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    rules: '',
    votersCustom: false,
    contractExecutor: '',
    contractDays: 0,
    contractHours: 0,
    contractMinutes: 0
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