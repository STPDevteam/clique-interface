import { TransactionResponse } from '@ethersproject/providers'
import { useGasPriceInfo } from 'hooks/useGasPrice'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

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
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Stake STPT'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useStakeCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
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
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Cancel stake STPT'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCancelStakeCallback',
              JSON.stringify(err?.data?.message || err?.error?.message || err?.message || 'unknown error'),
              method,
              JSON.stringify(args)
            )
            ReactGA.event({
              category: `catch-${method}`,
              action: `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
              label: JSON.stringify(args)
            })
          }
          throw err
        })
    },
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}
