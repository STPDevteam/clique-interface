import { createAction } from '@reduxjs/toolkit'
import { CreateDaoDataRule } from 'state/building/actions'

export interface CrossCreateDaoDataBasic {
  baseChainId: number | undefined
  daoName: string
  contractAddress: string
  description: string
  tokenPhoto: string
  websiteLink: string
  twitterLink: string
  discordLink: string
}

export const updateCrossBuildingBasicDao = createAction<{ crossCreateDaoDataBasic: CrossCreateDaoDataBasic }>(
  'crossBuilding/updateCrossBuildingBasicDao'
)
export const updateCrossBuildingRuleDao = createAction<{ crossCreateDaoDataRule: CreateDaoDataRule }>(
  'crossBuilding/updateCrossBuildingRuleDao'
)
export const removeCrossBuildingDao = createAction('crossBuilding/removeCrossBuildingDao')
