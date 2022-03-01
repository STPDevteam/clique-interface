import { createAction } from '@reduxjs/toolkit'
import { CreateDaoDataRule } from 'state/building/actions'

export interface ExternalCreateDaoDataBasic {
  daoName: string
  contractAddress: string
  description: string
  tokenPhoto: string
  websiteLink: string
  twitterLink: string
  discordLink: string
}

export const updateExternalBuildingBasicDao = createAction<{ externalCreateDaoDataBasic: ExternalCreateDaoDataBasic }>(
  'externalBuilding/updateExternalBuildingBasicDao'
)
export const updateExternalBuildingRuleDao = createAction<{ externalCreateDaoDataRule: CreateDaoDataRule }>(
  'externalBuilding/updateExternalBuildingRuleDao'
)
export const removeExternalBuildingDao = createAction('externalBuilding/removeExternalBuildingDao')
