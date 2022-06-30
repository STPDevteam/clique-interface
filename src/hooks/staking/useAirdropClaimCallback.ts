import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'
import { useGasPriceInfo } from 'hooks/useGasPrice'

export function useAirdropClaimCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (airdropId: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')

      const args = [airdropId]
      const method = 'claim'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Claim airdrop'
        })
        return response.hash
      })
    },
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}
