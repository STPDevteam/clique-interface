import { useFarmStakingContract } from '../useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useMemo } from 'react'

export function useUserAirdropClaimable(
  account: string | undefined,
  airdropId: number | undefined
): {
  loading: boolean
  result: string | undefined
} {
  const contract = useFarmStakingContract()

  const res = useSingleCallResult(account && airdropId ? contract : null, 'claimable', [account, airdropId])
  console.log('🚀 ~ file: useAirdropinfo.ts ~ line 37 ~ res', res.result?.[0].toString(), airdropId)

  const ret = useMemo(() => {
    if (!res.result) return undefined
    return res.result[0].toString()
  }, [res.result])

  return {
    loading: res.loading,
    result: ret
  }
}

export function useUserAirdropClaimed(
  account: string | undefined,
  airdropId: number | undefined
): {
  loading: boolean
  result: boolean | undefined
} {
  const contract = useFarmStakingContract()

  const res = useSingleCallResult(account && airdropId ? contract : null, 'userClaimed', [account, airdropId])

  const ret = useMemo(() => {
    if (!res.result) return undefined
    return res.result[0]
  }, [res.result])

  return {
    loading: res.loading,
    result: ret
  }
}

export function useAirdropClaimed(
  airdropId: number | undefined
): {
  loading: boolean
  result: string | undefined
} {
  const contract = useFarmStakingContract()

  const res = useSingleCallResult(airdropId ? contract : null, 'claimed', [airdropId])

  const ret = useMemo(() => {
    if (!res.result) return undefined
    return res.result[0].toString()
  }, [res.result])

  return {
    loading: res.loading,
    result: ret
  }
}

export function useAirdropData(id: number) {
  const contract = useFarmStakingContract()

  const res = useSingleCallResult(contract, 'airdropMap', [id])
  console.log('🚀 ~ file: useAirdropinfo.ts ~ line 74 ~ useAirdropData ~ res', res.result?.amount.toString())

  return {
    loading: res.loading,
    result: res.result
  }
}
