import { useCallback } from 'react'
import { useCrossDaoVerifierContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'
import { CurrencyAmount } from 'constants/token'

export function useStakeVerifiedCallback() {
  const contract = useCrossDaoVerifierContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (daoId: number, amount: CurrencyAmount) => {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      if (!account) {
        throw new Error('Unexpected error. account error')
      }
      const args = [daoId, amount.raw.toString()]
      console.log('args->', JSON.stringify(args), ...args)
      const method = 'stake'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasLimit,
        gasPrice,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Stake ${amount.toSignificant(6, { groupSeparator: ',' })} to verify DAO(${daoId})`,
            claim: { recipient: `${account}_stake_verify_${daoId}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useStakeVerifiedCallback',
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

export function useUnStakeVerifiedCallback() {
  const contract = useCrossDaoVerifierContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  return useCallback(
    async (daoId: number, amount: CurrencyAmount) => {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      if (!account) {
        throw new Error('Unexpected error. account error')
      }
      const args = [daoId, amount.raw.toString()]
      console.log('args->', JSON.stringify(args), ...args)
      const method = 'unstake'
      const { gasLimit, gasPrice } = await gasPriceInfoCallback(contract, method, args)

      return contract[method](...args, {
        gasLimit,
        gasPrice,
        from: account
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `unStake ${amount.toSignificant(6, { groupSeparator: ',' })} for DAO(${daoId})`,
            claim: { recipient: `${account}_unStake_verify_${daoId}` }
          })
          return response.hash
        })
        .catch((err: any) => {
          if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
            commitErrorMsg(
              'useStakeVerifiedCallback',
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
