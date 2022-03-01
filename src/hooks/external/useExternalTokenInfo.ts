import { useExternalTokenContract } from '../useContract'
import { useToken } from '../../state/wallet/hooks'
import { useEffect, useState } from 'react'
import { useTotalSupply } from 'data/TotalSupply'

export function useExternalTokenInfo(tokenAddress: string | undefined) {
  const contract = useExternalTokenContract(tokenAddress)
  const [isSupportShot, setIsSupportShot] = useState<boolean>()

  const token = useToken(tokenAddress)
  const ts = useTotalSupply(token)
  useEffect(() => {
    if (!contract) return
    try {
      contract.getCurrentSnapshotId().then(() => {
        setIsSupportShot(true)
      })
    } catch (_) {
      setIsSupportShot(false)
    }
  }, [contract])

  return {
    token,
    totalSupply: ts,
    isSupportShot
  }
}
