import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function usePartPubSaleCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (isETHER: boolean, payAmountInt: string, amountInt: string) => {
      if (!account) throw new Error('none account')
      if (!daoContract) throw new Error('none daoContract')

      const args = [amountInt]
      const method = 'partPubSale'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoContract, method, args)

      return daoContract[method](...args, {
        gasPrice,
        gasLimit,
        from: account,
        value: isETHER ? payAmountInt : undefined
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Buy token'
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'usePartPubSaleCallback',
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
    [account, addTransaction, daoContract, gasPriceInfoCallback]
  )
}
