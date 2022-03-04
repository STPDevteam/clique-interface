import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'

export function usePartPubSaleCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()

  return useCallback(
    (isETHER: boolean, payAmountInt: string, amountInt: string) => {
      if (!account) throw new Error('none account')
      if (!daoContract) throw new Error('none daoContract')

      return daoContract.estimateGas
        .partPubSale(amountInt, { from: account, value: isETHER ? payAmountInt : undefined })
        .then(estimatedGasLimit => {
          return daoContract
            .partPubSale(amountInt, {
              gasLimit: calculateGasMargin(estimatedGasLimit),
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
    [account, addTransaction, daoContract]
  )
}
