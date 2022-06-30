import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'

export function useReservedClaimCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(async (): Promise<string> => {
    if (!account) throw new Error('none account')
    if (!daoContract || !daoAddress) throw new Error('none daoContract')

    const method = 'withdrawReserved'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoContract, method, [])
    return daoContract[method]({
      gasPrice,
      gasLimit,
      from: account
    }).then((response: TransactionResponse) => {
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
  }, [account, addTransaction, daoAddress, daoContract, gasPriceInfoCallback])
}
