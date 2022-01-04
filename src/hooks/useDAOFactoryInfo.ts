import { useSingleCallResult } from '../state/multicall/hooks'
import { useDaoFactoryContract } from './useContract'

export function useLastDaoId() {
  const daoFactoryContract = useDaoFactoryContract()
  const lastDaoIdRes = useSingleCallResult(daoFactoryContract, 'curDaoId', [])
  return lastDaoIdRes.result ? Number(lastDaoIdRes.result.toString()) : 0
}

export function useDaoContractAddressById(id: number | string | undefined) {
  const daoFactoryContract = useDaoFactoryContract()
  const daoAddressRes = useSingleCallResult(id ? daoFactoryContract : null, 'daoMap', [id])
  return daoAddressRes.result ? daoAddressRes.result[0] : undefined
}
