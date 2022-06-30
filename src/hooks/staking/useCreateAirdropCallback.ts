import { TransactionResponse } from '@ethersproject/providers'
import { useGasPriceInfo } from 'hooks/useGasPrice'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../'
import { useFarmStakingContract } from '../useContract'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useCreateAirdropCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useFarmStakingContract()
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (tokenAddress: string, amountRaw: string, startTime: number, tag: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [tokenAddress, amountRaw, startTime, tag]

      const method = 'airdrop'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasPrice,
        gasLimit,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Airdrop publish',
            tag: {
              type: 'airdropPublish',
              key: '',
              id: tag
            }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useCreateAirdropCallback',
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
    [account, addTransaction, contract, gasPriceInfoCallback]
  )
}
