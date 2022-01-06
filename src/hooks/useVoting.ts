import { useSingleCallResult } from '../state/multicall/hooks'
import { useVotingContract } from './useContract'

export function useProposalNumber(votingAddress: string | undefined, daoAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const proposalIdsRes = useSingleCallResult(daoAddress ? votingContract : null, 'curId', [])
  return proposalIdsRes.result?.[0].toString() || undefined
}
