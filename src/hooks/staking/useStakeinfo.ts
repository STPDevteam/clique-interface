import { useFarmStakingContract } from '../useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { TokenAmount } from '../../constants/token'
import { useMemo } from 'react'
import { BAST_TOKEN } from '../../constants'
import { useActiveWeb3React } from 'hooks'

export function useStakeInfo(
  address: string | undefined
): {
  loading: boolean
  result:
    | {
        stakeAmt: TokenAmount
        weight: TokenAmount
        firstUndoneId: number
        updateTime: number
      }
    | undefined
} {
  const contract = useFarmStakingContract()
  const { chainId } = useActiveWeb3React()

  const res = useSingleCallResult(address ? contract : null, 'userStakeInfoCurrent', [address])

  const ret = useMemo(() => {
    if (!res.result) return undefined
    if (!chainId || !BAST_TOKEN[chainId]) return undefined
    const _data = res.result[0]
    return {
      stakeAmt: new TokenAmount(BAST_TOKEN[chainId], _data.stakeAmt.toString()),
      weight: new TokenAmount(BAST_TOKEN[chainId], _data.weight.toString()),
      firstUndoneId: Number(_data.firstUndoneId),
      updateTime: Number(_data.updateTime)
    }
  }, [chainId, res.result])

  return {
    loading: res.loading,
    result: ret
  }
}
