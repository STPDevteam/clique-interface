import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'
import { useWeb3Instance } from 'hooks/useWeb3Instance'

export function useStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()

  return useCallback(
    (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract || !web3) throw new Error('none contract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return contract
          .stake(amountRaw, {
            gasPrice: calculateGasPriceMargin(gasPrice),
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
    [account, addTransaction, contract, web3]
  )
}

export function useCancelStakeCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()

  return useCallback(
    (amountRaw: string) => {
      if (!account) throw new Error('none account')
      if (!contract || !web3) throw new Error('none contract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return contract
          .cancelStake(amountRaw, {
            gasPrice: calculateGasPriceMargin(gasPrice),
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
    [account, addTransaction, contract, web3]
  )
}
