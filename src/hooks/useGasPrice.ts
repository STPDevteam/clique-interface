import { useCallback } from 'react'
import { useWeb3Instance } from './useWeb3Instance'
import { Contract } from '@ethersproject/contracts'
import { calculateGasPriceMargin, calculateGasMargin } from 'utils'
import { BigNumber } from 'ethers'

export function useGasPriceInfo() {
  const web3 = useWeb3Instance()

  return useCallback(
    async (contract: Contract, method: string, args: any[]) => {
      if (!web3) throw new Error('web3 is null')

      let gasPrice: string | undefined = undefined
      let estimatedGas: BigNumber | undefined = undefined

      try {
        gasPrice = await web3.eth.getGasPrice()
      } catch (error) {
        console.log(error)
        throw new Error('Get gas error, please try again. Or you can try to replace the rpc.')
      }
      try {
        estimatedGas = await contract.estimateGas[method](...args)
      } catch (error) {
        console.log(error)
        const err = error as any
        throw new Error(
          `${err?.data?.message ||
            err?.error?.message ||
            err?.message ||
            'unknown error'}. Please try the substitute RPC if you are experiencing frequent contract execution error,learn more: https://stp-dao.gitbook.io/verse-network/clique/connect-your-wallet`
        )
      }
      return {
        gasPrice: calculateGasPriceMargin(gasPrice),
        gasLimit: calculateGasMargin(estimatedGas)
      }
    },
    [web3]
  )
}
