import { useToken } from 'state/wallet/hooks'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useDaoContract } from './useContract'

export function useReceiveToken(daoAddress: string | undefined) {
  const daoContract = useDaoContract(daoAddress)
  const receiveTokenRes = useSingleCallResult(daoContract, 'receiveToken', [])
  return useToken(receiveTokenRes.result?.[0])
}
