import { createReducer } from '@reduxjs/toolkit'
import { CreateDaoDataRule } from 'state/building/actions'
import {
  updateCrossBuildingBasicDao,
  updateCrossBuildingRuleDao,
  removeCrossBuildingDao,
  CrossCreateDaoDataBasic
} from './actions'

export interface CrossCreateDaoData {
  basic: CrossCreateDaoDataBasic
  rule: CreateDaoDataRule
}

const initialDaoDataState: CrossCreateDaoData = {
  basic: {
    baseChainId: undefined,
    daoName: '',
    contractAddress: '',
    description: '',
    tokenPhoto: '',
    websiteLink: '',
    twitterLink: '',
    discordLink: ''
  },
  rule: {
    minVoteNumber: '1',
    minCreateProposalNumber: '1',
    minApprovalNumber: '1',
    days: 3,
    hours: 0,
    minutes: 0,
    rules: '',
    votersCustom: false,
    contractExecutor: '',
    contractDays: 3,
    contractHours: 0,
    contractMinutes: 0
  }
}

export default createReducer(initialDaoDataState, builder =>
  builder
    .addCase(removeCrossBuildingDao, state => {
      state.basic = initialDaoDataState.basic
      state.rule = initialDaoDataState.rule
    })
    .addCase(updateCrossBuildingBasicDao, (state, { payload }) => {
      state.basic = {
        ...state.basic,
        ...payload.crossCreateDaoDataBasic
      }
    })
    .addCase(updateCrossBuildingRuleDao, (state, { payload }) => {
      state.rule = {
        ...state.rule,
        ...payload.crossCreateDaoDataRule
      }
    })
)
