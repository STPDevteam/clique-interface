import { useCallback } from 'react'
import { useCreateERC20Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useCreateERC20ClaimCallback() {
  const daoFactoryContract = useCreateERC20Contract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (address: string) => {
      if (!daoFactoryContract) {
        throw new Error('Unexpected error. Contract error')
      }
      const args = [address]
      console.log('args->', JSON.stringify(args), ...args)
      const method = 'claimReserve'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoFactoryContract, method, args)

      return daoFactoryContract[method](...args, {
        gasLimit,
        gasPrice,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Claim token',
            claim: { recipient: `${account}_${address}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCreateERC20ClaimCallback',
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
    [account, addTransaction, daoFactoryContract, gasPriceInfoCallback]
  )
}
