import { DefaultChainId } from '../constants'
import { Token, TokenAmount } from 'constants/token'
import { useEffect, useState } from 'react'
import { getAccountERC20Tokens, getTokenHolders, getTokenInfo } from 'utils/fetch/stpExplorer'
import JSBI from 'jsbi'
import { useActiveWeb3React } from 'hooks'

interface ExplorerTokenInfo {
  name: string
  symbol: string
  address: string
  decimals: number
  holdersCount: string
}

export function useTokenInfoByExplorer(tokenAddress: string | undefined) {
  const [data, setData] = useState<ExplorerTokenInfo>()
  useEffect(() => {
    if (!tokenAddress) return
    getTokenInfo(tokenAddress)
      .then(res => {
        const data = res.data.result
        setData({
          name: data.name,
          symbol: data.symbol,
          address: tokenAddress,
          decimals: data.decimals,
          holdersCount: data.holdersCount
        })
      })
      .catch(() => {
        setData(undefined)
      })
  }, [tokenAddress])

  return data
}

interface TokenHoldersList {
  account: string
  balance: TokenAmount
  rank: number
  percentage: number
}
export function useTokenHoldersByExplorer(tokenAddress: string | undefined) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TokenHoldersList[]>()
  useEffect(() => {
    if (!tokenAddress) return
    setLoading(true)
    getTokenHolders(tokenAddress)
      .then(res => {
        const data: any = res.data
        const token = new Token(DefaultChainId, data.token.address, data.token.decimals)
        const list: TokenHoldersList[] = data.holders.map((item: any) => {
          return {
            account: item.address,
            balance: new TokenAmount(token, JSBI.BigInt(item.balance)),
            rank: item.rank,
            percentage: Number(item.percentage)
          }
        })
        setData(list)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setData(undefined)
      })
  }, [tokenAddress])

  return {
    data,
    loading
  }
}

export function useAccountERC20Tokens() {
  const { account, chainId } = useActiveWeb3React()
  const [data, setData] = useState<TokenAmount[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!account || !chainId || chainId !== DefaultChainId) {
      setData([])
      return
    }
    setLoading(true)
    getAccountERC20Tokens(account)
      .then(res => {
        const data: any = res.data
        const ret = data.tokens.map((item: { address: string; decimals: number; balance: string; symbol: string }) => {
          const token = new Token(chainId, item.address, item.decimals, item.symbol)
          return new TokenAmount(token, JSBI.BigInt(item.balance))
        })
        setData(ret)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setData([])
        setLoading(false)
      })
  }, [account, chainId])

  return {
    loading,
    data
  }
}
