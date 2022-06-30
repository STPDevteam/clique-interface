import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useVotingContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'

export function useResolveVotingResultCallback(votingAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const votingContract = useVotingContract(votingAddress)
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (id: string) => {
      if (!votingContract) throw new Error('none votingContract')

      const args = [id]
      const method = 'resolveVotingResult'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(votingContract, method, args)

      return votingContract[method](...args, {
        gasPrice,
        gasLimit
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Resolve voting result'
        })
        return response.hash
      })
    },
    [addTransaction, gasPriceInfoCallback, votingContract]
  )
}
