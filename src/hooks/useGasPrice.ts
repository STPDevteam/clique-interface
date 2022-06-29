import { useCallback } from 'react'
import { useWeb3Instance } from './useWeb3Instance'
import { Contract } from '@ethersproject/contracts'
import { calculateGasPriceMargin, calculateGasMargin } from 'utils'

export function useGasPriceInfo() {
  const web3 = useWeb3Instance()

  return useCallback(
    async (contract: Contract, method: string, args: any[]) => {
      if (!web3) throw new Error('web3 is null')

      try {
        const gasPrice = await web3.eth.getGasPrice()
        const estimatedGas = await contract.estimateGas[method](...args)
        return {
          gasPrice: calculateGasPriceMargin(gasPrice),
          gasLimit: calculateGasMargin(estimatedGas)
        }
      } catch (error) {
        console.log(error)
        throw new Error('get gas error')
      }
    },
    [web3]
  )
}
