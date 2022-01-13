import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useSTPTokenContract, useVotingContract } from './useContract'
import { ProposalStatusProp, ProposalType } from './useCreateCommunityProposalCallback'

export function useProposalNumber(votingAddress: string | undefined, daoAddress: string | undefined) {
  const votingContract = useVotingContract(votingAddress)
  const proposalIdsRes = useSingleCallResult(daoAddress ? votingContract : null, 'curId', [])
  return proposalIdsRes.result?.[0].toString() || undefined
}

export interface ProposalInfoProp {
  id: string
  creator: string
  proType: ProposalType
  title: string
  content: string
  startTime: number
  endTime: number
  blkHeight: number
  status: ProposalStatusProp
}

export function useAllProposal(votingAddress: string | undefined): ProposalInfoProp[] {
  const votingContract = useVotingContract(votingAddress)
  const listRes = useSingleCallResult(votingContract, 'getAllProposal', [])
  return useMemo(() => {
    if (!listRes.result || !listRes.result[0].length) return []
    return listRes.result[0].map((item: any) => {
      return {
        id: item.id.toString(),
        creator: item.creator,
        proType: item.proType,
        title: item.title,
        content: item.content,
        startTime: Number(item.startTime.toString()),
        endTime: Number(item.startTime.toString()),
        blkHeight: item.blkHeight.toString(),
        status: item.status
      }
    })
  }, [listRes.result])
}

export function useBalanceOfAt(tokenAddress: string | undefined, blkHeight: number | undefined): string | undefined {
  const { account } = useActiveWeb3React()
  const tokenContract = useSTPTokenContract(tokenAddress)
  const res = useSingleCallResult(blkHeight && account ? tokenContract : null, 'balanceOfAt', [
    account || undefined,
    blkHeight
  ])
  return useMemo(() => {
    if (!tokenAddress || !blkHeight) return undefined
    if (!res.result) return undefined
    return res.result[0].toString()
  }, [blkHeight, res.result, tokenAddress])
}

export function useVotingOptionsById(
  votingAddress: string | undefined,
  proposalId: string
): {
  name: string
  amount: string
}[] {
  const votingContract = useVotingContract(votingAddress)
  const res = useSingleCallResult(proposalId ? votingContract : null, 'getOptionsById', [proposalId])
  return (
    res.result?.[0].map((item: any) => ({
      name: item.name,
      amount: item.amount.toString()
    })) || []
  )
}
