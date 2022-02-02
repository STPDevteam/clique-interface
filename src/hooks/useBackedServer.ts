import { DefaultChainId } from '../constants'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import {
  getAccountDaoHolds,
  getAssetsTransferRecord,
  getDaoMembers,
  getMyWalletHistory,
  getPriPubSwapList,
  getProposalStatusDateline,
  getProposalVoteList,
  getWithdrawReservedList,
  queryDaoByTokenAddress
} from '../utils/fetch/server'
import { ProposalStatusProp } from './useCreateCommunityProposalCallback'
import { getCurrentTimeStamp } from 'utils/dao'

export function useQueryDaoByTokenAddress(tokenAddress: string) {
  const { chainId } = useActiveWeb3React()
  const [result, setResult] = useState<string>()
  useEffect(() => {
    ;(async () => {
      if (!chainId || !tokenAddress) {
        setResult(undefined)
        return
      }
      try {
        const res = await queryDaoByTokenAddress(chainId, tokenAddress)
        const data = res.data.data
        if (!data) {
          setResult(undefined)
          return
        }
        setResult(data.daoAddress)
      } catch (error) {
        setResult(undefined)
        console.error('useQueryDaoByTokenAddress', error)
      }
    })()
  }, [chainId, tokenAddress])

  return result
}

export interface AssetsTransferRecordProp {
  hash: string
  type: 'deposit' | 'withdraw'
  timeStamp: number
  value: string
  mark: string
  tokenAddress: string
}

export function useAssetsTransferRecord(daoAddress: string) {
  const { chainId } = useActiveWeb3React()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 5
  const [result, setResult] = useState<AssetsTransferRecordProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!daoAddress) {
        setResult([])
        return
      }
      setIsLoading(true)
      try {
        const res = await getAssetsTransferRecord(chainId || DefaultChainId, daoAddress, currentPage, pageSize)
        setIsLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => ({
          hash: item.hash,
          type: item.type,
          timeStamp: item.timeStamp,
          value: item.value,
          mark: item.to.toUpperCase() === daoAddress.toUpperCase() ? '+' : '-',
          tokenAddress: item.token
        }))
        setResult(list)
      } catch (error) {
        setIsLoading(false)

        console.error('useAssetsTransferRecord', error)
      }
    })()
  }, [chainId, currentPage, daoAddress])

  return {
    loading: isLoading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    result
  }
}

export interface OfferingSwapProp {
  hash: string
  timeStamp: number
  daoAmt: string
  receiveAmt: string
}
export interface OfferingReservedProp {
  hash: string
  timeStamp: number
  daoAmt: string
}
export function useOfferingSwapRecord(daoAddress: string | undefined) {
  const { chainId } = useActiveWeb3React()
  const [swapLoading, setSwapLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [swap, setSwap] = useState<OfferingSwapProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!daoAddress) {
        setSwap([])
        return
      }
      setSwapLoading(true)
      try {
        const res = await getPriPubSwapList(chainId || DefaultChainId, daoAddress, currentPage, pageSize)
        setSwapLoading(false)
        const data = res.data.data
        if (!data) {
          setSwap([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => ({
          hash: item.hash,
          timeStamp: item.timeStamp,
          daoAmt: item.daoAmt,
          receiveAmt: item.receiveAmt
        }))
        setSwap(list)
      } catch (error) {
        setSwap([])
        setSwapLoading(false)
        console.error('useOfferingSwapRecord', error)
      }
    })()
  }, [chainId, currentPage, daoAddress])

  return {
    loading: swapLoading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    swap
  }
}

export function useOfferingReservedRecord(daoAddress: string | undefined) {
  const { chainId } = useActiveWeb3React()
  const [reservedLoading, setReservedLoading] = useState<boolean>(false)
  const [reserved, setReserved] = useState<OfferingReservedProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!daoAddress) {
        setReserved([])
        return
      }
      setReservedLoading(true)
      try {
        const res = await getWithdrawReservedList(chainId || DefaultChainId, daoAddress)
        setReservedLoading(false)
        const data = res.data.data
        if (!data) {
          setReserved([])
          return
        }
        const list = data.map((item: any) => ({
          hash: item.hash,
          timeStamp: item.timeStamp,
          daoAmt: item.amount
        }))
        setReserved(list)
      } catch (error) {
        setReserved([])
        setReservedLoading(false)
        console.error('useOfferingReservedRecord', error)
      }
    })()
  }, [chainId, daoAddress])

  return {
    loading: reservedLoading,
    reserved
  }
}

export interface ProposalVoteProp {
  address: string
  optionIndex: number
  votes: string
}
export function useProposalVoteList(votingAddress: string | undefined, proposalId: string) {
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<ProposalVoteProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!votingAddress) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getProposalVoteList(
          chainId || DefaultChainId,
          proposalId,
          votingAddress,
          currentPage,
          pageSize
        )
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => ({
          address: item.address,
          optionIndex: item.optionIndex,
          votes: item.votes
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useProposalVoteList', error)
      }
    })()
  }, [chainId, currentPage, proposalId, votingAddress])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    result
  }
}

export interface MyWalletHistoryProp {
  type: string
  hash: string
  timeStamp: number
  from: string
  to: string
  tokenArray: {
    address: string
    value: string
    mark: string
  }[]
}
export function useMyWalletHistory() {
  const { chainId, account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<MyWalletHistoryProp[]>([])

  useEffect(() => {
    ;(async () => {
      if (!account || !chainId) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getMyWalletHistory(chainId, account, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => {
          const tokenArray: {
            address: string
            value: string
            mark: string
          }[] = []
          if (item.tokenIn && item.valueIn) {
            tokenArray.push({
              address: item.tokenIn,
              value: item.valueIn,
              mark: '+'
            })
          }
          if (item.tokenOut && item.valueOut) {
            tokenArray.push({
              address: item.tokenOut,
              value: item.valueOut,
              mark: '-'
            })
          }
          return {
            type: item.type,
            hash: item.hash,
            timeStamp: item.timeStamp,
            from: item.tokenOut ? account : item.address,
            to: item.tokenOut ? item.address : account,
            tokenArray
          }
        })
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useMyWalletHistory', error)
      }
    })()
  }, [account, chainId, currentPage])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    result
  }
}

export interface ProposalStatusDatelineProp {
  timeStamp: number
  hash?: string
  name: string
}
export function useProposalStatusDateline(
  votingAddress: string | undefined,
  proposalId: string | undefined,
  status: ProposalStatusProp
) {
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<ProposalStatusDatelineProp[]>([])
  useEffect(() => {
    ;(async () => {
      if (!votingAddress || !proposalId) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getProposalStatusDateline(chainId || DefaultChainId, proposalId, votingAddress)
        const data = res.data.data
        setLoading(false)
        if (!data) {
          setResult([])
          return
        }
        const lastStatus: 'create' | 'cancel' | 'execute' = data[data.length - 1].type
        const baseInfo = data[0]
        const lastInfo = data[data.length - 1]
        const currentTimeStamp = getCurrentTimeStamp()
        const ret: ProposalStatusDatelineProp[] = []
        ret.push({
          name: 'Create',
          hash: baseInfo.hash,
          timeStamp: baseInfo.timeStamp
        })
        const activeTimeStamp = baseInfo.timeStamp > baseInfo.startTime ? baseInfo.timeStamp : baseInfo.startTime
        if (lastStatus === 'create') {
          if (currentTimeStamp > baseInfo.startTime) {
            ret.push({
              name: 'Active',
              timeStamp: activeTimeStamp
            })
          }

          if (status === ProposalStatusProp.Success) {
            ret.push({
              name: 'Succeded',
              timeStamp: baseInfo.endTime
            })
          }
          if (status === ProposalStatusProp.Failed) {
            ret.push({
              name: 'Failed',
              timeStamp: baseInfo.endTime
            })
          }
        }

        if (lastStatus === 'cancel') {
          if (currentTimeStamp > baseInfo.startTime && lastInfo.timeStamp > baseInfo.startTime) {
            ret.push({
              name: 'Active',
              timeStamp: activeTimeStamp
            })
          }
          ret.push({
            name: 'Canceled',
            hash: lastInfo.hash,
            timeStamp: lastInfo.timeStamp
          })
        }

        if (lastStatus === 'execute') {
          ret.push({
            name: 'Active',
            timeStamp: activeTimeStamp
          })
          ret.push({
            name: 'Succeded',
            timeStamp: baseInfo.endTime
          })
          ret.push({
            name: 'Executed',
            hash: lastInfo.hash,
            timeStamp: lastInfo.timeStamp
          })
        }

        setResult(ret)
      } catch (error) {
        setLoading(false)
        setResult([])
        console.error('useProposalStatusDateline', error)
      }
    })()
  }, [chainId, proposalId, status, votingAddress])

  return {
    loading,
    result
  }
}

export function useDaoMembers(daoTokenAddress: string | undefined) {
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<
    {
      holderAddress: string
      tokenAddress: string
      balance: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      if (!chainId || !daoTokenAddress) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getDaoMembers(chainId, daoTokenAddress, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => {
          return {
            holderAddress: item.holderAddress,
            tokenAddress: item.tokenAddress,
            balance: item.balance
          }
        })
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useDaoMembers', error)
      }
    })()
  }, [chainId, currentPage, daoTokenAddress])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    result
  }
}

export function useAccountDaoAssets() {
  const { chainId, account } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 8
  const [result, setResult] = useState<
    {
      holderAddress: string
      tokenAddress: string
      balance: string
      daoAddress: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const res = await getAccountDaoHolds(chainId, account, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => {
          return {
            holderAddress: item.holderAddress,
            tokenAddress: item.tokenAddress,
            balance: item.balance,
            daoAddress: item.daoAddress
          }
        })
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useAccountDaoAssets', error)
      }
    })()
  }, [chainId, currentPage, account])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    list: result
  }
}
