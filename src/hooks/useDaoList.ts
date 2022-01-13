import { useMemo, useState } from 'react'
import { useDaoAddressListByIds, useLastDaoId, useMultiDaoBaseInfo } from './useDAOInfo'

export function useDaoAddressLists(pageSize = 16) {
  const lastId = useLastDaoId()
  const begin = 1
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = useMemo(() => {
    return lastId ? Math.ceil(lastId - begin + 1 / pageSize) : 0
  }, [lastId, pageSize])

  const ids = useMemo(() => {
    const ret = []
    let index = lastId - (currentPage - 1) * pageSize
    while (index > lastId - currentPage * pageSize && index >= begin) {
      ret.push(index)
      index--
    }
    return ret
  }, [lastId, currentPage, pageSize])
  const daoAddresss = useDaoAddressListByIds(ids)

  return {
    page: {
      totalPages,
      setCurrentPage
    },
    daoAddresss
  }
}

export function useHomeDaoList() {
  const { daoAddresss, page } = useDaoAddressLists()

  const daoList = useMultiDaoBaseInfo(daoAddresss)

  return {
    page,
    list: daoList
  }
}
