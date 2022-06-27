import { useActiveWeb3React } from './index'
import { useCreateERC20Contract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../constants'
import { useTokens } from 'state/wallet/hooks'
import { useMemo } from 'react'
import { TokenAmount } from 'constants/token'

export function useCreateTokenReserved() {
  const { account, chainId } = useActiveWeb3React()
  const contract = useCreateERC20Contract()

  const res = useSingleCallResult(
    chainId && account && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId) ? contract : undefined,
    'getReserved',
    [account ?? undefined]
  )
  const reserved = res.result?.[0]

  const tokenAddresss = useMemo(() => {
    return reserved?.map((item: any) => item.token) || []
  }, [reserved])

  const tokens = useTokens(tokenAddresss)

  return useMemo(() => {
    if (!reserved || !tokens) return undefined
    return tokens
      ?.map((token, index) => {
        if (!token) return undefined
        return {
          tokenAmount: new TokenAmount(token, reserved[index].amount.toString()),
          lockDate: Number(reserved[index].lockDate.toString())
        }
      })
      .filter(i => i) as {
      tokenAmount: TokenAmount
      lockDate: number
    }[]
  }, [reserved, tokens])
}
