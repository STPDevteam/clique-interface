import { useMemo, useState } from 'react'
import { useLastDaoId } from './useDAOFactoryInfo'

export function useHomeDaoList() {
  const lastId = useLastDaoId()
  const pageSize = 8
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = useMemo(() => {
    return lastId ? Math.ceil(lastId / pageSize) : 0
  }, [lastId])

  const inputs = useMemo(() => {
    const ret = []
    let index = (currentPage - 1) * pageSize
    while (index < currentPage * pageSize && index <= lastId) {
      ret.push([index])
      index++
    }
    return ret
  }, [lastId, currentPage])
  console.log('🚀 ~ file: useDaoList.ts ~ line 22 ~ inputs ~ inputs', inputs)

  return {
    page: {
      totalPages,
      setCurrentPage
    }
  }
}
