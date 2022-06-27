import { useWeb3Instance } from './useWeb3Instance'
import { useBlockNumber } from 'state/application/hooks'
import { useEffect, useState } from 'react'

export function useTransactionReceipt(hash: string) {
  const web3 = useWeb3Instance()
  const block = useBlockNumber()
  const [result, setResult] = useState<any | undefined>()
  const [stop, setStop] = useState(false)

  useEffect(() => {
    if (!web3 || !hash || stop) return
    web3.eth.getTransactionReceipt(hash).then(receipt => {
      if (receipt) {
        console.log(
          '🚀 ~ file: useTransactionReceipt.ts ~ line 12 ~ web3?.eth.getTransactionReceipt ~ receipt',
          receipt
        )
        setStop(true)
        setResult(receipt)
      }
    })
  }, [block, hash, stop, web3])

  return result
}
