import { Token, TokenAmount } from 'constants/token'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTokens } from 'state/wallet/hooks'
import { isAddress } from 'utils'
import { useActiveWeb3React } from '../'
import { myAirdropList, airdropList } from '../../utils/fetch/staking'

export interface MyAirdropResProp {
  creatorAddress: string
  airdropAmount: string
  airdropTime: number
  id: number
  mediumLink: string
  status: 'offChain' | 'onChain'
  tokenContractAddress: string
  tokenLogo: string
  airdropId: number
  token?: Token
}

export interface AirdropResProp {
  airdropId: number
  amount: string
  blockNumber: number
  mediumLink: string
  startTime: number
  tokenContractAddress: string
  tokenLogo: string
  token?: Token
  airdropAmount?: TokenAmount
}

export function useMyAirdropList() {
  const { chainId, account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<MyAirdropResProp[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    setLoading(true)
  }, [chainId, account])

  const changePage = useCallback(p => {
    setLoading(true)
    setCurrentPage(p)
  }, [])

  const reload = useCallback(() => {
    setIndex(index + 1)
  }, [index])

  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) {
        setResult([])
        return
      }
      try {
        const res = await myAirdropList(chainId, account, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        setTotal(data.totalCount)
        if (!data) {
          setResult([])
          return
        }
        setResult(data.data)
        setTimeout(() => setIndex(index + 1), 30000)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useMyAirdropList', error)
      }
    })()
  }, [chainId, currentPage, account, index])

  const tokenAddresss = useMemo(
    () => result.map(i => (isAddress(i.tokenContractAddress) ? i.tokenContractAddress : undefined)),
    [result]
  )
  const tokens = useTokens(tokenAddresss)

  const ret = useMemo(() => {
    return result.map((item, idx) => {
      item.token = tokens?.[idx]
      return item
    })
  }, [result, tokens])

  return {
    loading: loading,
    reload,
    page: {
      setCurrentPage: changePage,
      currentPage,
      total,
      pageSize
    },
    list: ret
  }
}

export function useAirdropList() {
  const { chainId, account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<AirdropResProp[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    setLoading(true)
  }, [chainId, account])

  const changePage = useCallback(p => {
    setLoading(true)
    setCurrentPage(p)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) {
        setResult([])
        return
      }
      try {
        const res = await airdropList(chainId, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        setTotal(data.totalCount)
        if (!data) {
          setResult([])
          return
        }
        const _list = data.data.map((item: any) => ({
          airdropId: item.airdropId,
          amount: item.amount,
          blockNumber: item.blockNumber,
          mediumLink: item.mediumLink,
          startTime: item.startTime,
          tokenContractAddress: item.token,
          tokenLogo: item.tokenLogo
        }))
        setResult(_list)
        setTimeout(() => setIndex(index + 1), 30000)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useMyAirdropList', error)
      }
    })()
  }, [chainId, currentPage, account, index])

  const tokenAddresss = useMemo(
    () => result.map(i => (isAddress(i.tokenContractAddress) ? i.tokenContractAddress : undefined)),
    [result]
  )
  const tokens = useTokens(tokenAddresss)

  const ret = useMemo(() => {
    return result.map((item, idx) => {
      item.token = tokens?.[idx]
      if (item.token) {
        item.airdropAmount = new TokenAmount(item.token, item.amount)
      }
      return item
    })
  }, [result, tokens])

  return {
    loading: loading,
    page: {
      setCurrentPage: changePage,
      currentPage,
      total,
      pageSize
    },
    list: ret
  }
}
