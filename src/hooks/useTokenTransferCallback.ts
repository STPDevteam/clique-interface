import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useTokenContract } from './useContract'

export function useTokenTransferCallback(tokenAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const tokenContract = useTokenContract(tokenAddress)
  const { account } = useActiveWeb3React()

  return useCallback(
    (to: string, value: string) => {
      if (!account) throw new Error('none account')
      if (!tokenContract) throw new Error('none votingContract')

      return tokenContract.estimateGas.transfer(to, value, { from: account }).then(estimatedGasLimit => {
        return tokenContract
          .transfer(to, value, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Transfer'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, tokenContract]
  )
}
