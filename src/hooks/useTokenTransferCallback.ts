import { calculateGasPriceMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useTokenContract } from './useContract'
import { useWeb3Instance } from './useWeb3Instance'

export function useTokenTransferCallback(tokenAddress: string | undefined) {
  const addTransaction = useTransactionAdder()
  const tokenContract = useTokenContract(tokenAddress)
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()

  return useCallback(
    (to: string, value: string, isETHER = false) => {
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
        return web3.eth.getGasPrice().then(gasPrice => {
          return tokenContract
            .transfer(to, value, {
              gasPrice: calculateGasPriceMargin(gasPrice),
              // gasLimit: '3500000',
              from: account
            })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                summary: 'Transfer'
              })
              return response.hash
            })
        })
      }
    },
    [account, addTransaction, tokenContract, web3]
  )
}
