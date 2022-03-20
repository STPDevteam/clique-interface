import { useCallback } from 'react'
import { createMyAirdrop, MyAirdropReqProp, editMyAirdrop } from '../../utils/fetch/staking'
import { useActiveWeb3React } from '../'

export function useCreateMyAirdrop() {
  const { chainId, account } = useActiveWeb3React()
  return useCallback(
    (data: MyAirdropReqProp) => {
      return new Promise((resolve, reject) => {
        if (!chainId || !account) {
          reject('Please connect Wallet')
          return
        }
        createMyAirdrop(chainId, account, data)
          .then((res: any) => {
            if (res.data.code !== 0) {
              reject(res.data.msg)
            }
            resolve('ok')
          })
          .catch(() => reject('Network error'))
      })
    },
    [account, chainId]
  )
}

export function useEditMyAirdrop() {
  return useCallback((id: number, data: MyAirdropReqProp) => {
    return new Promise((resolve, reject) => {
      editMyAirdrop(id, data)
        .then((res: any) => {
          if (res.data.code !== 0) {
            reject(res.data.msg)
          }
          resolve('ok')
        })
        .catch(() => reject('Network error'))
    })
  }, [])
}
