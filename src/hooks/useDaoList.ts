import { Verified_ADDRESS } from 'constants/verified'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useState } from 'react'
import { useDaoAddressListByIds, useLastDaoId, useMultiDaoBaseInfo } from './useDAOInfo'

export function useDaoAddressLists(pageSize = 16) {
  const lastId = useLastDaoId()
  const begin = 1
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { chainId } = useActiveWeb3React()

  const totalPages = useMemo(() => {
    return lastId ? Math.ceil((lastId - begin + 1) / pageSize) : 0
  }, [lastId, pageSize])

  const sortIds = useMemo(() => {
    if (!lastId) return []
    const verifiedIds = chainId ? Verified_ADDRESS[chainId].map(({ id }) => id).reverse() : []
    const _ret = Object.keys(new Array(lastId).fill(''))
      .map(i => Number(i) + 1)
      .filter(v => !verifiedIds.includes(v))
    return [..._ret, ...verifiedIds]
  }, [chainId, lastId])

  const ids = useMemo(() => {
    const ret = []
    let index = lastId - (currentPage - 1) * pageSize
    while (index > lastId - currentPage * pageSize && index >= begin) {
      ret.push(sortIds[index - 1])
      index--
    }
    return ret
  }, [lastId, currentPage, pageSize, sortIds])

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
    loading
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
