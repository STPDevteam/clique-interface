import { ZERO_ADDRESS } from '../constants'
import { Currency } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'state/wallet/hooks'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useDaoContract } from './useContract'
import { useMemo } from 'react'

export function useReceiveToken(daoAddress: string | undefined) {
  const { chainId } = useActiveWeb3React()
  const daoContract = useDaoContract(daoAddress)
  const receiveTokenRes = useSingleCallResult(daoContract, 'receiveToken', [])
  const _token = useToken(receiveTokenRes.result?.[0])
  return useMemo(() => {
    if (!receiveTokenRes.result) return undefined
    if (receiveTokenRes.result[0] === ZERO_ADDRESS) {
      return Currency.get_ETH_TOKEN(chainId || 1)
    }
    return _token
  }, [_token, chainId, receiveTokenRes.result])
}
