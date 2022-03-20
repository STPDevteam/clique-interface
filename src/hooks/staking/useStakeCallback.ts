import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'

export function useStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()

  return useCallback(
    (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      return contract.estimateGas.stake(amountRaw, { from: account }).then(estimatedGasLimit => {
        return contract
          .stake(amountRaw, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Stake STPT'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
}

export function useCancelStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()

  return useCallback(
    (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      return contract.estimateGas.cancelStake(amountRaw, { from: account }).then(estimatedGasLimit => {
        return contract
          .cancelStake(amountRaw, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Cancel stake STPT'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
}
