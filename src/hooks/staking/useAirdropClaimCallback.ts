import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'

export function useAirdropClaimCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()

  return useCallback(
    (airdropId: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      return contract.estimateGas.claim(airdropId, { from: account }).then(estimatedGasLimit => {
        return contract
          .claim(airdropId, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Claim airdrop'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
}
