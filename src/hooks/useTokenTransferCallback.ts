import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useTokenContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useTokenTransferCallback(tokenAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const tokenContract = useTokenContract(tokenAddress)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (to: string, value: string, isETHER = false) => {
      if (!account) throw new Error('none account')
      if (isETHER) {
        if (!web3) throw new Error('none web3')
        return web3.eth.getGasPrice().then(gasPrice => {
          return new Promise((resolve, reject) => {
            web3.eth
              .sendTransaction({
                from: account,
                to,
                value,
                gasPrice: calculateGasPriceMargin(gasPrice)
              })
              .on('transactionHash', function(hash) {
                addTransaction({ hash, confirmations: 0, from: account, nonce: 0 } as TransactionResponse, {
                  summary: 'Transfer'
                })
                resolve(hash)
              })
              .catch(error => reject(error))
          })
        })
      } else {
        if (!tokenContract || !web3) throw new Error('none tokenContract')
        const args = [to, value]
        const method = 'transfer'
        const { gasLimit, gasPrice } = await gasPriceInfoCallback(tokenContract, method, args)

        return tokenContract[method](...args, {
          gasPrice,
          gasLimit,
          from: account
        })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Transfer'
            })
            return response.hash
          })
          .catch((err: any) => {
            if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
              commitErrorMsg(
                'useTokenTransferCallback',
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
      }
    },
    [account, addTransaction, gasPriceInfoCallback, tokenContract, web3]
  )
}
