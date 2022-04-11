import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'

export function useReservedClaimCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()

  return useCallback((): Promise<string> => {
    if (!account) throw new Error('none account')
    if (!daoContract || !daoAddress) throw new Error('none daoContract')

    return daoContract.estimateGas.withdrawReserved({ from: account }).then(estimatedGasLimit => {
      return daoContract
        .withdrawReserved({
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Claim private token',
            tag: {
              type: 'claimReserved',
              key: '',
              id: daoAddress
            }
          })
          return response.hash
        })
    })
  }, [account, addTransaction, daoAddress, daoContract])
}
