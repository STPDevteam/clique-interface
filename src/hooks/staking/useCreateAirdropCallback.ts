import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'

export function useCreateAirdropCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()

  return useCallback(
    (tokenAddress: string, amountRaw: string, startTime: number, tag: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [tokenAddress, amountRaw, startTime, tag]

      return contract.estimateGas.airdrop(...args, { from: account }).then(estimatedGasLimit => {
        return contract
          .airdrop(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Airdrop publish'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
}
