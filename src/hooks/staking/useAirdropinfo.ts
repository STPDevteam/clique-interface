import { useFarmStakingContract } from '../useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'

export function useUserAirdropClaimable(
  account: string | undefined,
  airdropId: number | undefined
): {
  loading: boolean
  result: string | undefined
} {
  const contract = useFarmStakingContract()

  const res = useSingleCallResult(account && airdropId ? contract : null, 'claimable', [account, airdropId])

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

  return {
    loading: res.loading,
    result: res.result
  }
}

export function useTimeStampByBlockNumber(block: number | undefined) {
  const { library } = useActiveWeb3React()
  const [time, setTime] = useState<number>()

  useEffect(() => {
    if (!library || !block) {
      setTime(undefined)
      return
    }
    library
      .getBlock(block)
      .then(res => {
        setTime(res.timestamp)
      })
      .catch(() => {
        setTime(undefined)
      })
  }, [block, library])

  return time
}
