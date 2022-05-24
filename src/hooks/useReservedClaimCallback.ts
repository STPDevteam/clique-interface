import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'

export function useReservedClaimCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()

  return useCallback((): Promise<string> => {
    if (!account) throw new Error('none account')
    if (!daoContract || !daoAddress || !web3) throw new Error('none daoContract')

    return web3.eth.getGasPrice().then(gasPrice => {
      return daoContract
        .withdrawReserved({
          gasPrice: calculateGasPriceMargin(gasPrice),
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
  }, [account, addTransaction, daoAddress, daoContract, web3])
}
