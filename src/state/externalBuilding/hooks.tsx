import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateDaoDataRule } from 'state/building/actions'
import { AppDispatch, AppState } from '../index'
import {
  updateExternalBuildingBasicDao,
  updateExternalBuildingRuleDao,
  removeExternalBuildingDao,
  ExternalCreateDaoDataBasic
} from './actions'

export function useExternalBuildingDataCallback() {
  const buildingDaoData = useSelector((state: AppState) => state.externalBuildingDao)

  const dispatch = useDispatch<AppDispatch>()
  const updateBasic = useCallback(
    (externalCreateDaoDataBasic: ExternalCreateDaoDataBasic) => {
      dispatch(updateExternalBuildingBasicDao({ externalCreateDaoDataBasic }))
    },
    [dispatch]
  )
  const updateRule = useCallback(
    (externalCreateDaoDataRule: CreateDaoDataRule) => {
      dispatch(updateExternalBuildingRuleDao({ externalCreateDaoDataRule }))
    },
    [dispatch]
  )
  const removeBuildingDaoData = useCallback(() => {
    dispatch(removeExternalBuildingDao())
  }, [dispatch])

  return {
    updateBasic,
    updateRule,
    removeBuildingDaoData,
    buildingDaoData
  }
}

export function useExternalCommitCreateDaoData() {
  const buildingDaoData = useSelector((state: AppState) => state.externalBuildingDao)

  const { basic, rule } = buildingDaoData
  const basicData: ExternalCreateDaoDataBasic = Object.assign(
    { ...basic },
    {
      daoName: basic.daoName.trim(),
      description: basic.description.trim(),
      contractAddress: basic.contractAddress.trim(),
      tokenPhoto: basic.tokenPhoto.trim(),
      websiteLink: basic.websiteLink.trim(),
      twitterLink: basic.twitterLink.trim(),
      discordLink: basic.discordLink.trim()
    }
  )
  const ruleData: CreateDaoDataRule = Object.assign({ ...rule }, { rules: rule.rules.trim() })

  return {
    basicData,
    ruleData
  }
}
