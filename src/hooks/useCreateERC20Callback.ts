import { useCallback, useMemo } from 'react'
import { useTrueCreateTokenData } from '../state/createToken/hooks'
import { amountAddDecimals } from '../utils/dao'
import { useCreateERC20Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPriceInfo } from './useGasPrice'
import ReactGA from 'react-ga4'
import { commitErrorMsg } from 'utils/fetch/server'

export function useCreateERC20Callback() {
  const { basicData, distributionData } = useTrueCreateTokenData()
  const daoFactoryContract = useCreateERC20Contract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPriceInfoCallback = useGasPriceInfo()

  const args = useMemo(() => {
    const _basicParams = {
      name: basicData.tokenName,
      symbol: basicData.tokenSymbol,
      logoUrl: basicData.tokenPhoto,
      decimal: basicData.tokenDecimals,
      totalSupply: amountAddDecimals(basicData.tokenSupply, basicData.tokenDecimals)
    }

    const _distribution = distributionData.map(item => [
      item.address,
      amountAddDecimals(item.tokenNumber || '0', basicData.tokenDecimals),
      item.lockDate
    ])

    return [...Object.values(_basicParams), _distribution]
  }, [basicData, distributionData])

  return useCallback(async () => {
    if (!daoFactoryContract) {
      throw new Error('Unexpected error. Contract error')
    }
    console.log('args->', JSON.stringify(args), ...args)
    const method = 'createERC20'
    const { gasLimit, gasPrice } = await gasPriceInfoCallback(daoFactoryContract, method, args)

    return daoFactoryContract[method](...args, {
      gasLimit,
      gasPrice,
      from: account
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Create token'
        })
        return response.hash
      })
      .catch((err: any) => {
        if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
          commitErrorMsg(
            'useCreateERC20Callback',
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
  }, [account, addTransaction, args, daoFactoryContract, gasPriceInfoCallback])
}
