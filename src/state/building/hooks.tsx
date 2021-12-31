import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { ReactComponent as IconTokenSvg } from '../../assets/images/icon-token.svg'
import {
  updateBuildingBasicDao,
  updateBuildingDistributionDao,
  updateBuildingRuleDao,
  removeBuildingDao,
  CreateDaoDataBasic,
  CreateDaoDataDistribution,
  CreateDaoDataRule,
  PrivateReceivingTokenProps
} from './actions'

export const privateReceivingTokens: PrivateReceivingTokenProps[] = [
  { name: 'STEP', value: 'STEP', logo: <IconTokenSvg /> }
]

export function useBuildingData() {
  const buildingDaoData = useSelector((state: AppState) => state.buildingDao)

  const dispatch = useDispatch<AppDispatch>()
  const updateBasic = useCallback(
    (createDaoDataBasic: CreateDaoDataBasic) => {
      dispatch(updateBuildingBasicDao({ createDaoDataBasic }))
    },
    [dispatch]
  )
  const updateDistribution = useCallback(
    (createDaoDataDistribution: CreateDaoDataDistribution) => {
      dispatch(updateBuildingDistributionDao({ createDaoDataDistribution }))
    },
    [dispatch]
  )
  const updateRule = useCallback(
    (createDaoDataRule: CreateDaoDataRule) => {
      dispatch(updateBuildingRuleDao({ createDaoDataRule }))
    },
    [dispatch]
  )
  const removeBuildingDaoData = useCallback(() => {
    dispatch(removeBuildingDao())
  }, [dispatch])

  return {
    updateBasic,
    updateDistribution,
    updateRule,
    removeBuildingDaoData,
    buildingDaoData
  }
}
