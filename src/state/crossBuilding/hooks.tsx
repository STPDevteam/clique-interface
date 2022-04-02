import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateDaoDataRule } from 'state/building/actions'
import { AppDispatch, AppState } from '../index'
import {
  updateCrossBuildingBasicDao,
  updateCrossBuildingRuleDao,
  removeCrossBuildingDao,
  CrossCreateDaoDataBasic
} from './actions'

export function useCrossBuildingDataCallback() {
  const buildingDaoData = useSelector((state: AppState) => state.crossBuildingDao)

  const dispatch = useDispatch<AppDispatch>()
  const updateBasic = useCallback(
    (crossCreateDaoDataBasic: CrossCreateDaoDataBasic) => {
      dispatch(updateCrossBuildingBasicDao({ crossCreateDaoDataBasic }))
    },
    [dispatch]
  )
  const updateRule = useCallback(
    (crossCreateDaoDataRule: CreateDaoDataRule) => {
      dispatch(updateCrossBuildingRuleDao({ crossCreateDaoDataRule }))
    },
    [dispatch]
  )
  const removeBuildingDaoData = useCallback(() => {
    dispatch(removeCrossBuildingDao())
  }, [dispatch])

  return {
    updateBasic,
    updateRule,
    removeBuildingDaoData,
    buildingDaoData
  }
}

export function useCrossCommitCreateDaoData() {
  const buildingDaoData = useSelector((state: AppState) => state.crossBuildingDao)

  const { basic, rule } = buildingDaoData
  const basicData: CrossCreateDaoDataBasic = Object.assign(
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
