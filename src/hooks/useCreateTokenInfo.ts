import { useActiveWeb3React } from './index'
import { useCreateERC20Contract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../constants'
import { useTokens } from 'state/wallet/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Token, TokenAmount } from 'constants/token'

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

export function useCreateTokenList() {
  const { account, chainId } = useActiveWeb3React()
  const contract = useCreateERC20Contract()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8

  const res = useSingleCallResult(
    chainId && account && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId) ? contract : undefined,
    'getTokens',
    [account ?? undefined, pageSize, (currentPage - 1) * pageSize]
  )

  const resResult = useMemo(() => res.result?.[0], [res.result])

  useEffect(() => {
    setTotal(resResult?.size ? Number(resResult.size.toString()) : 0)
  }, [resResult])

  const list: Token[] = useMemo(
    () =>
      resResult?.list.map((item: any) => {
        return new Token(
          chainId || SUPPORT_CREATE_TOKEN_NETWORK[0],
          item.addr,
          item.decimal,
          item.symbol,
          item.symbol,
          item.logoURL
        )
      }) || [],
    [chainId, resResult?.list]
  )

  return {
    loading: res.loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    list
  }
}
