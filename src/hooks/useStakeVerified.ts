import { useMemo } from 'react'
import { useCrossDaoVerifierContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useToken } from '../state/wallet/hooks'
import { Token, TokenAmount } from '../constants/token'

export function useStakeSTPTToken(): Token | undefined {
  const contract = useCrossDaoVerifierContract()
  const res = useSingleCallResult(contract, 'STPT_ADDRESS')
  return useToken(res.result?.[0])
}

export function useStakeAmountByDaoId(id: number | undefined): TokenAmount | undefined {
  const contract = useCrossDaoVerifierContract()
  const stptToken = useStakeSTPTToken()
  const res = useSingleCallResult(id ? contract : null, 'amountByDaoId', [id])

  return useMemo(() => {
    if (!stptToken || !res.result?.[0]) return undefined
    return new TokenAmount(stptToken, res.result[0].toString())
  }, [res.result, stptToken])
}

export function useVerificationThreshold(): TokenAmount | undefined {
  const contract = useCrossDaoVerifierContract()

  const stptToken = useStakeSTPTToken()
  const res = useSingleCallResult(contract, 'verificationThreshold')

  return useMemo(() => {
    if (!stptToken || !res.result?.[0]) return undefined
    return new TokenAmount(stptToken, res.result[0].toString())
  }, [res.result, stptToken])
}

export function useIsStakeVerifiedDao(id: number | undefined, address: string | undefined) {
  const verificationThreshold = useVerificationThreshold()
  const stakeAmountByDaoId = useStakeAmountByDaoId(id)

  return useMemo(() => {
    if (!verificationThreshold || !stakeAmountByDaoId) return false
    console.log(
      '🚀 ~ file: useStakeVerified.ts ~ line 42 ~ returnuseMemo ~ verificationThreshold',
      verificationThreshold.toSignificant(),
      stakeAmountByDaoId.toSignificant()
    )
    return !stakeAmountByDaoId.lessThan(verificationThreshold)
  }, [stakeAmountByDaoId, verificationThreshold])
}
