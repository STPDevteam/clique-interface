import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useDaoContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useReservedClaimCallback(daoAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const daoContract = useDaoContract(daoAddress)
  const { account } = useActiveWeb3React()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(async (): Promise<string> => {
    if (!account) throw new Error('none account')
    if (!daoContract || !daoAddress) throw new Error('none daoContract')

    const args: any = []
    const method = 'withdrawReserved'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoContract, method, args)
    return daoContract[method]({
      gasPrice,
      gasLimit,
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
      .catch((err: any) => {
        if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
          commitErrorMsg(
            'useReservedClaimCallback',
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
  }, [account, addTransaction, daoAddress, daoContract, gasPriceInfoCallback])
}
