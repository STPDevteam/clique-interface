import { TransactionResponse } from '@ethersproject/providers'
import { useGasPriceInfo } from 'hooks/useGasPrice'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'

export function useStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [amountRaw]
      const method = 'stake'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Stake STPT'
        })
        return response.hash
      })
    },
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}

export function useCancelStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [amountRaw]
      const method = 'cancelStake'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Cancel stake STPT'
        })
        return response.hash
      })
    },
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}
