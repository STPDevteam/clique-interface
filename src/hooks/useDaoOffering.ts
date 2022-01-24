import { useMemo } from 'react'
import { useDaoContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useReservedClaimed(daoAddress: string | undefined, account: string | undefined): boolean | undefined {
  const daoContract = useDaoContract(daoAddress)
  const reservedClaimedRes = useSingleCallResult(account ? daoContract : null, 'reservedClaimed', [account])

  return useMemo(() => {
    if (!daoAddress || !account || !reservedClaimedRes.result) return undefined
    return reservedClaimedRes.result[0]
  }, [account, daoAddress, reservedClaimedRes])
}

export function useIsPriSoldAddress(daoAddress: string | undefined, account: string | undefined): boolean | undefined {
  const daoContract = useDaoContract(daoAddress)
  const priSoldAddressRes = useSingleCallResult(account ? daoContract : null, 'priSoldAddress', [account])

  return useMemo(() => {
    if (!daoAddress || !account || !priSoldAddressRes.result) return undefined
    return priSoldAddressRes.result[0]
  }, [account, daoAddress, priSoldAddressRes])
}

export function usePubSoldAmtPerAddress(
  daoAddress: string | undefined,
  account: string | undefined
): string | undefined {
  const daoContract = useDaoContract(daoAddress)
  const priSoldAddressRes = useSingleCallResult(account ? daoContract : null, 'pubSoldAmtPerAddress', [account])

  return useMemo(() => {
    if (!daoAddress || !account || !priSoldAddressRes.result) return undefined
    return priSoldAddressRes.result[0].toString()
  }, [account, daoAddress, priSoldAddressRes])
}

export function usePubSoldAmt(daoAddress: string | undefined): string | undefined {
  const daoContract = useDaoContract(daoAddress)
  const pubSoldAmtRes = useSingleCallResult(daoContract, 'pubSoldAmt', [])

  return pubSoldAmtRes.result?.[0].toString()
}
