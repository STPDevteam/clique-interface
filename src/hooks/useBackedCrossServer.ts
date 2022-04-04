import { getCreateProposalSign, getCrossBalance, getCrossTokenInfo, getCrossVotingSign } from '../utils/fetch/server'
import { useActiveWeb3React } from '.'
import { useEffect, useState } from 'react'
import { useCrossVotingContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export interface CrossSignDataProp {
  balance: string
  chainId: number
  nonce: number
  sign: string
  userAddress: string
  votingAddress: string
}
export function useCreateProposalSignData(targetChainId: number | undefined, daoAddress: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const [result, setResult] = useState<CrossSignDataProp>()
  useEffect(() => {
    ;(async () => {
      if (!chainId || !account || !targetChainId || !daoAddress) {
        setResult(undefined)
        return
      }
      try {
        const res = await getCreateProposalSign(chainId, targetChainId, daoAddress, account)
        const data = res.data.data
        if (!data) {
          setResult(undefined)
          return
        }
        setResult(data)
      } catch (error) {
        setResult(undefined)
        console.error('useCreateProposalSignData', error)
      }
    })()
  }, [account, chainId, daoAddress, targetChainId])

  return result
}

export function useVotingSignData(
  targetChainId: number | undefined,
  daoAddress: string | undefined,
  proposalId: number | undefined
) {
  const { chainId, account } = useActiveWeb3React()
  const [result, setResult] = useState<CrossSignDataProp>()
  const [reload, setReload] = useState(0)
  useEffect(() => {
    ;(async () => {
      if (!chainId || !account || !targetChainId || !daoAddress || !proposalId) {
        setResult(undefined)
        return
      }
      try {
        const res = await getCrossVotingSign(chainId, targetChainId, daoAddress, account, proposalId)
        const data = res.data.data
        console.log('🚀 ~ file: useBackedCrossServer.ts ~ line 49 ~ ; ~ data', data)
        if (!data) {
          setResult(undefined)
          setTimeout(() => setReload(reload + 1), 6000)
          return
        }
        setResult(data)
      } catch (error) {
        setResult(undefined)
        setTimeout(() => setReload(reload + 1), 6000)
        console.error('useVotingSignData', error)
      }
    })()
  }, [account, chainId, daoAddress, proposalId, targetChainId, reload])

  return result
}

export function useCrossTokenInfo(daoAddress: string | undefined, votingAddress: string | undefined) {
  const contract = useCrossVotingContract(votingAddress)
  const [reload, setReload] = useState(0)
  const [tokenAddress, setTokenAddress] = useState<string>()

  const chain = useSingleCallResult(contract, 'chainId', [])

  useEffect(() => {
    ;(async () => {
      if (!daoAddress) {
        setTokenAddress(undefined)
        return
      }
      try {
        const res = await getCrossTokenInfo(daoAddress)
        const data = res.data.data
        if (!data) {
          setTokenAddress(undefined)
          setTimeout(() => setReload(reload + 1), 6000)
          return
        }
        setTokenAddress(data.tokenAddress)
      } catch (error) {
        setTokenAddress(undefined)
        setTimeout(() => setReload(reload + 1), 6000)
        console.error('useCrossTokenInfo', error)
      }
    })()
  }, [daoAddress, reload])

  return {
    tokenAddress,
    chainId: chain.result ? Number(chain.result?.[0].toString()) : undefined
  }
}

export function useCrossBalanceOfAt(
  targetChainId: number | undefined,
  daoAddress: string,
  proposalId: number | string
) {
  const { account, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState<string>()
  useEffect(() => {
    ;(async () => {
      if (!chainId || !targetChainId || !daoAddress || !account || !proposalId) {
        setBalance(undefined)
        return
      }
      try {
        const res = await getCrossBalance(chainId, targetChainId, daoAddress, account, proposalId)
        const data = res.data.data
        if (!data) {
          setBalance(undefined)
          return
        }
        setBalance(data.tokenAddress)
      } catch (error) {
        setBalance(undefined)
        console.error('useCrossBalanceOfAt', error)
      }
    })()
  }, [account, chainId, daoAddress, proposalId, targetChainId])

  return balance
}
