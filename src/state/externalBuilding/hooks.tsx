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
  const buildingDaoData = useSelector((state: AppState) => state.buildingDao)

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
