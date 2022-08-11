import { useEffect, useMemo, useState } from 'react'
import { useCrossDaoContractForPolygon, useCrossDaoVerifierContract, useDaoFactoryContract } from './useContract'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useMulticallToken } from '../state/wallet/hooks'
import { Token, TokenAmount } from '../constants/token'
import { queryDaoIdByDaoAddress, queryDaoList } from 'utils/fetch/server'
import { useActiveWeb3React } from 'hooks'
import { SUPPORT_STAKE_VERIFY_NETWORK, SUPPORT_CROSS_STAKE_VERIFY_NETWORK, ZERO_ADDRESS } from '../constants'

const stakeChainId = SUPPORT_STAKE_VERIFY_NETWORK
const crossDaoChainId = SUPPORT_CROSS_STAKE_VERIFY_NETWORK

export function useStakeSTPTToken(): Token | null | undefined {
  const contract = useCrossDaoVerifierContract()
  const res = useSingleCallResult(contract, 'STPT_ADDRESS', [], undefined, stakeChainId)
  return useMulticallToken(res.result?.[0], stakeChainId)
}

export function useStakeAmountByDaoId(id: number | undefined): TokenAmount | undefined {
  const contract = useCrossDaoVerifierContract()
  const stptToken = useStakeSTPTToken()
  const res = useSingleCallResult(id ? contract : null, 'amountByDaoId', [id], undefined, stakeChainId)

  return useMemo(() => {
    if (!stptToken || !res.result?.[0]) return undefined
    return new TokenAmount(stptToken, res.result[0].toString())
  }, [res.result, stptToken])
}

export function useVerificationThreshold(): TokenAmount | undefined {
  const contract = useCrossDaoVerifierContract()

  const stptToken = useStakeSTPTToken()
  const res = useSingleCallResult(contract, 'verificationThreshold', [], undefined, stakeChainId)

  return useMemo(() => {
    if (!stptToken || !res.result?.[0]) return undefined
    return new TokenAmount(stptToken, res.result[0].toString())
  }, [res.result, stptToken])
}

export function useIsStakeVerifiedDao(id: number | undefined, address: string | undefined) {
  const [addressId, setAddressId] = useState<number>()
  const verificationThreshold = useVerificationThreshold()
  const stakeAmountByDaoId = useStakeAmountByDaoId(id || addressId)

  useEffect(() => {
    ;(async () => {
      if (!address) {
        setAddressId(undefined)
        return
      }
      try {
        const res = await queryDaoIdByDaoAddress(crossDaoChainId, address)
        setAddressId(res.data.data.id)
      } catch (error) {
        setAddressId(undefined)
      }
    })()
  }, [address])

  return useMemo(() => {
    if (!verificationThreshold || !stakeAmountByDaoId) return false
    return !stakeAmountByDaoId.lessThan(verificationThreshold)
  }, [stakeAmountByDaoId, verificationThreshold])
}

export function useCumulativeStaked() {
  const contract = useCrossDaoVerifierContract()

  const res = useSingleCallResult(contract, 'cumulativeStaked', [], undefined, stakeChainId)
  const stptToken = useStakeSTPTToken()

  return useMemo(() => {
    if (!stptToken || !res.result?.[0]) return undefined
    return new TokenAmount(stptToken, res.result[0].toString())
  }, [res.result, stptToken])
}

export interface StakedDaoInfoProp {
  daoId: number
  myStakedAmount: TokenAmount
  daoAddress: string
  stakedAmountTotal: TokenAmount
  verifiedTimestamp: number
}

export function useMyStakedDao(): StakedDaoInfoProp[] | undefined {
  const { account } = useActiveWeb3React()
  const contract = useCrossDaoVerifierContract()

  const res = useSingleCallResult(account ? contract : null, 'getMyStakedDao', [account || ''], undefined, stakeChainId)
  const stptToken = useStakeSTPTToken()

  const daoFactoryContract = useDaoFactoryContract(crossDaoChainId)
  const ids = useMemo(() => res.result?.[0].map((i: any) => Number(i.daoId.toString())) || [], [res.result]) as number[]
  const daoAddressRes = useSingleContractMultipleData(
    ids.length ? daoFactoryContract : null,
    'daoMap',
    ids.map(item => [item]),
    NEVER_RELOAD,
    crossDaoChainId
  )

  return useMemo(() => {
    if (!res.result?.[0] || !stptToken || !daoAddressRes?.[0]?.result?.[0]) return undefined
    return res.result[0]
      .map((item: any, index: number) => {
        if (
          !daoAddressRes?.[index]?.result?.[0].toString() ||
          daoAddressRes?.[index]?.result?.[0].toString() === ZERO_ADDRESS
        )
          return undefined
        return {
          daoId: Number(item.daoId.toString()),
          daoAddress: daoAddressRes?.[index]?.result?.[0].toString() || '',
          myStakedAmount: new TokenAmount(stptToken, item.stakedAmount.toString()),
          stakedAmountTotal: new TokenAmount(stptToken, item.stakedAmountTotal.toString()),
          verifiedTimestamp: Number(item.verifiedTimestamp.toString())
        }
      })
      .filter((i: any) => i)
  }, [daoAddressRes, res.result, stptToken])
}

export function useVerifiedDaoByIds(ids: number[]): StakedDaoInfoProp[] | undefined {
  const contract = useCrossDaoVerifierContract()
  const { account } = useActiveWeb3React()
  const stptToken = useStakeSTPTToken()

  const res = useSingleCallResult(
    ids.length ? contract : null,
    'getVerifiedDaoByIds',
    [ids, account ? account : ZERO_ADDRESS],
    undefined,
    stakeChainId
  )

  const daoFactoryContract = useDaoFactoryContract(crossDaoChainId)
  const daoAddressRes = useSingleContractMultipleData(
    ids.length ? daoFactoryContract : null,
    'daoMap',
    ids.map(item => [item]),
    NEVER_RELOAD,
    crossDaoChainId
  )

  return useMemo(() => {
    if (!res.result?.[0] || !stptToken || !daoAddressRes?.[0]?.result?.[0]) return undefined
    return res.result[0]
      .map((item: any, index: number) => {
        if (
          !daoAddressRes?.[index]?.result?.[0].toString() ||
          daoAddressRes?.[index]?.result?.[0].toString() === ZERO_ADDRESS
        )
          return undefined
        return {
          daoId: Number(item.daoId.toString()),
          daoAddress: daoAddressRes?.[index]?.result?.[0].toString() || '',
          myStakedAmount: new TokenAmount(stptToken, item.stakedAmount.toString()),
          stakedAmountTotal: new TokenAmount(stptToken, item.stakedAmountTotal.toString()),
          verifiedTimestamp: Number(item.verifiedTimestamp.toString())
        }
      })
      .filter((i: any) => i)
  }, [daoAddressRes, res.result, stptToken])
}

export function useStakeDaoList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const pageSize = 10
  const [result, setResult] = useState<
    {
      daoId: number
      daoAddress: string
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await queryDaoList(crossDaoChainId, currentPage, pageSize)
        setLoading(false)
        const data = res.data.data
        if (!data) {
          setResult([])
          return
        }
        setTotal(data.totalCount)
        const list = data.data.map((item: any) => ({
          daoId: item.id,
          daoAddress: item.daoAddress
        }))
        setResult(list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useStakeDaoList', error)
      }
    })()
  }, [currentPage])

  return {
    loading,
    page: {
      setCurrentPage,
      currentPage,
      total,
      pageSize
    },
    list: result
  }
}

export function useStakeDaoBaseInfo(
  id: number,
  daoAddress: string
):
  | {
      id: number
      daoAddress: string
      daoName: string | undefined
      logo: string | undefined
    }
  | undefined {
  const daoContract = useCrossDaoContractForPolygon(daoAddress)
  const daoNameRes = useSingleCallResult(daoContract, 'name', [], NEVER_RELOAD, crossDaoChainId)
  const tokenLogoRes = useSingleCallResult(daoContract, 'tokenLogo', [], NEVER_RELOAD, crossDaoChainId)

  return {
    id,
    daoAddress,
    daoName: daoNameRes.result?.[0],
    logo: tokenLogoRes.result?.[0]
  }
}

export function useStakeVerifiedDaoList(): StakedDaoInfoProp[] | undefined {
  const contract = useCrossDaoVerifierContract()
  const stptToken = useStakeSTPTToken()

  const res = useSingleCallResult(contract, 'getVerifiedDao', [ZERO_ADDRESS], undefined, stakeChainId)

  return useMemo(() => {
    if (!res.result?.[0] || !stptToken) return undefined
    return res.result[0].map((item: any) => {
      return {
        daoId: Number(item.daoId.toString()),
        daoAddress: '',
        myStakedAmount: new TokenAmount(stptToken, item.stakedAmount.toString()),
        stakedAmountTotal: new TokenAmount(stptToken, item.stakedAmountTotal.toString()),
        verifiedTimestamp: Number(item.verifiedTimestamp.toString())
      }
    })
  }, [res.result, stptToken])
}
