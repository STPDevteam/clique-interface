import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useVotingContract } from './useContract'
import { ProposalType } from './useCreateCommunityProposalCallback'

export function useProposalNumber(votingAddress: string | undefined, daoAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const proposalIdsRes = useSingleCallResult(daoAddress ? votingContract : null, 'curId', [])
  return proposalIdsRes.result?.[0].toString() || undefined
}

export interface ProposalInfoProp {
  creator: string
  proType: ProposalType
  title: string
  content: string
  startTime: number
  endTime: number
  blkHeight: number
  approve: string
  disapprove: string
  status: number
}

export function useAllProposal(votingAddress: string | undefined): ProposalInfoProp[] {
  const votingContract = useVotingContract(votingAddress)
  const listRes = useSingleCallResult(votingContract, 'getAllProposal', [])
  return useMemo(() => {
    if (!listRes.result) return []
    return listRes.result.map(i => {
      const item = i[0] as any
      return {
        creator: item.creator,
        proType: item.proType,
        title: item.title,
        content: item.content,
        startTime: Number(item.startTime.toString()),
        endTime: Number(item.startTime.toString()),
        blkHeight: item.blkHeight.toString(),
        approve: item.approve.toString(),
        disapprove: item.disapprove.toString(),
        status: item.status
      }
    })
  }, [listRes.result])
}
