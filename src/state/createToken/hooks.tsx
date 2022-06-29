import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateCreateTokenDataBasic,
  updateCreateTokenDataDistribution,
  removeCreateTokenData,
  CreateTokenDataBasic,
  CreateTokenDataDistribution
} from './actions'

export function useCreateTokenDataCallback() {
  const createTokenData = useSelector((state: AppState) => state.createTokenData)

  const dispatch = useDispatch<AppDispatch>()
  const updateBasic = useCallback(
    (createTokenDataBasic: CreateTokenDataBasic) => {
      dispatch(updateCreateTokenDataBasic({ createTokenDataBasic }))
    },
    [dispatch]
  )
  const updateDistribution = useCallback(
    (createTokenDataDistribution: CreateTokenDataDistribution[]) => {
      dispatch(updateCreateTokenDataDistribution({ createTokenDataDistribution }))
    },
    [dispatch]
  )
  const removeCreateTokenDataCallback = useCallback(() => {
    dispatch(removeCreateTokenData())
  }, [dispatch])

  return {
    updateBasic,
    updateDistribution,
    removeCreateTokenDataCallback,
    createTokenData
  }
}

export function useTrueCreateTokenData() {
  const createTokenData = useSelector((state: AppState) => state.createTokenData)

  const { basic, distribution } = createTokenData
  const basicData: CreateTokenDataBasic = Object.assign(
    { ...basic },
    {
      tokenName: basic.tokenName.trim(),
      tokenSymbol: basic.tokenSymbol.trim(),
      tokenPhoto: basic.tokenPhoto.trim()
    }
  )

  return {
    basicData,
    distributionData: distribution
  }
}

export function useRemainderTokenAmount(): string {
  const createTokenData = useSelector((state: AppState) => state.createTokenData)
  const { distribution, basic } = createTokenData

  const currentUsedTokenAmount = useMemo(
    () =>
      distribution.length
        ? distribution
            .map(item => item.tokenNumber)
            .reduce((pre, cur) => new BigNumber(pre || '0').plus(cur || '0').toString()) || '0'
        : '0',
    [distribution]
  )

  return useMemo(() => {
    const ret = new BigNumber(basic.tokenSupply || '0').minus(currentUsedTokenAmount)
    return ret.gt(0) ? ret.toFixed(0) : '0'
  }, [basic.tokenSupply, currentUsedTokenAmount])
}
