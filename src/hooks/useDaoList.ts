import { SUPPORT_CROSS_STAKE_VERIFY_NETWORK } from '../constants'
import { Verified_ADDRESS } from 'constants/verified'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useState } from 'react'
import { useDaoAddressListByIds, useLastDaoId, useMultiDaoBaseInfo } from './useDAOInfo'
import { useStakeVerifiedDaoList } from './useStakeVerified'

function useVerifiedIds() {
  const { chainId } = useActiveWeb3React()
  const defaultVerifiedIds = useMemo(
    () =>
      chainId && chainId !== SUPPORT_CROSS_STAKE_VERIFY_NETWORK
        ? Verified_ADDRESS[chainId].map(({ id }) => id).reverse()
        : [],
    [chainId]
  )
  const stakeVerifiedDaoList = useStakeVerifiedDaoList()

  const stakeVerifiedDaoIds = useMemo(() => {
    if (!stakeVerifiedDaoList) return undefined
    const _tempList = [...stakeVerifiedDaoList]
    for (let index = 0; index < _tempList.length - 1; index++) {
      for (let index2 = 0; index2 < _tempList.length - index - 1; index2++) {
        const cur = _tempList[index2]
        const next = _tempList[index2 + 1]
        const tmp = _tempList[index2]
        if (cur.stakedAmountTotal.lessThan(next.stakedAmountTotal)) {
          _tempList[index2] = _tempList[index2 + 1]
          _tempList[index2 + 1] = tmp
        } else if (cur.stakedAmountTotal.equalTo(next.stakedAmountTotal)) {
          if (cur.verifiedTimestamp > next.verifiedTimestamp) {
            _tempList[index2] = _tempList[index2 + 1]
            _tempList[index2 + 1] = tmp
          }
        }
      }
    }
    return _tempList.map(i => i.daoId).reverse()
  }, [stakeVerifiedDaoList])

  return useMemo(() => {
    return chainId !== SUPPORT_CROSS_STAKE_VERIFY_NETWORK ? defaultVerifiedIds : stakeVerifiedDaoIds
  }, [chainId, defaultVerifiedIds, stakeVerifiedDaoIds])
}

export function useDaoAddressLists(pageSize = 16) {
  const lastId = useLastDaoId()
  const begin = 1
  const [currentPage, setCurrentPage] = useState<number>(1)
  const verifiedIds = useVerifiedIds()

  const totalPages = useMemo(() => {
    return lastId ? Math.ceil((lastId - begin + 1) / pageSize) : 0
  }, [lastId, pageSize])

  const sortIds = useMemo(() => {
    if (!lastId) return []
    if (!verifiedIds) return []

    const _ret = Object.keys(new Array(lastId).fill(''))
      .map(i => Number(i) + 1)
      .filter(v => !verifiedIds.includes(v))
    return [..._ret, ...verifiedIds]
  }, [verifiedIds, lastId])

  const ids = useMemo(() => {
    if (!verifiedIds) return []
    const ret = []
    let index = lastId - (currentPage - 1) * pageSize
    while (index > lastId - currentPage * pageSize && index >= begin) {
      ret.push(sortIds[index - 1])
      index--
    }
    return ret
  }, [lastId, currentPage, pageSize, sortIds, verifiedIds])

  const { loading, data: daoAddresss } = useDaoAddressListByIds(ids)

  return {
    page: {
      total: lastId,
      totalPages,
      currentPage,
      pageSize,
      setCurrentPage
    },
    daoAddresss,
    daoIds: ids,
    loading: loading || verifiedIds === undefined
  }
}

export function useHomeDaoList() {
  const { daoAddresss, daoIds, page, loading } = useDaoAddressLists()

  const { data: daoList, loading: infoLoading } = useMultiDaoBaseInfo(daoAddresss)

  const list = useMemo(() => {
    return daoList.map((item, index) => ({
      id: daoIds[index],
      ...item
    }))
  }, [daoIds, daoList])

  return {
    page,
    loading: loading || infoLoading,
    list
  }
}
