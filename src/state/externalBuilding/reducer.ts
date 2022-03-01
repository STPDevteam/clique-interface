import { createReducer } from '@reduxjs/toolkit'
import { CreateDaoDataRule } from 'state/building/actions'
import {
  updateExternalBuildingBasicDao,
  updateExternalBuildingRuleDao,
  removeExternalBuildingDao,
  ExternalCreateDaoDataBasic
} from './actions'

export interface ExternalCreateDaoData {
  basic: ExternalCreateDaoDataBasic
  rule: CreateDaoDataRule
}

const initialDaoDataState: ExternalCreateDaoData = {
  basic: {
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
    .addCase(removeExternalBuildingDao, state => {
      state.basic = initialDaoDataState.basic
      state.rule = initialDaoDataState.rule
    })
    .addCase(updateExternalBuildingBasicDao, (state, { payload }) => {
      state.basic = {
        ...state.basic,
        ...payload.externalCreateDaoDataBasic
      }
    })
    .addCase(updateExternalBuildingRuleDao, (state, { payload }) => {
      state.rule = {
        ...state.rule,
        ...payload.externalCreateDaoDataRule
      }
    })
)
