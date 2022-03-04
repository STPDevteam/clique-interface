import { useToken } from '../../state/wallet/hooks'
import { useEffect, useState } from 'react'
import { useTotalSupply } from 'data/TotalSupply'
import { useWeb3Instance } from 'hooks/useWeb3Instance'
import ExternalToken_ABI from '../../constants/abis/ExternalToken.json'
import { AbiItem } from 'web3-utils'

export function useExternalTokenInfo(tokenAddress: string | undefined) {
  const web3 = useWeb3Instance()
  const [isSupportShot, setIsSupportShot] = useState<boolean>()

  const token = useToken(tokenAddress)
  const ts = useTotalSupply(token)
  useEffect(() => {
    if (!web3) return
    const contract = new web3.eth.Contract(ExternalToken_ABI as AbiItem | AbiItem[], tokenAddress)
    try {
      contract.methods
        .getCurrentSnapshotId()
        .call()
        .then(() => {
          setIsSupportShot(true)
        })
    } catch (_) {
      setIsSupportShot(false)
    }
  }, [tokenAddress, web3])

  return {
    token,
    totalSupply: ts,
    isSupportShot
  }
}
