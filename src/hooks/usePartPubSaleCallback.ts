import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'

export function usePartPubSaleCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const web3 = useWeb3Instance()
  const { account } = useActiveWeb3React()

  return useCallback(
    (isETHER: boolean, payAmountInt: string, amountInt: string) => {
      if (!account) throw new Error('none account')
      if (!daoContract || !web3) throw new Error('none daoContract')

      return web3.eth.getGasPrice().then(gasPrice => {
        return daoContract
          .partPubSale(amountInt, {
            gasPrice: calculateGasPriceMargin(gasPrice),
            // gasLimit: '3500000',
            from: account,
            value: isETHER ? payAmountInt : undefined
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Buy token'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, daoContract, web3]
  )
}
