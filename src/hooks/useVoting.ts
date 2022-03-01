import { useActiveWeb3React } from 'hooks'
import { useMemo, useState } from 'react'
// import { getCurrentTimeStamp } from 'utils/dao'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
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
  minimumVote: string
  minimumValidVotes: string
  minimumCreateProposal: string
}

export function useProposalList(votingAddress: string | undefined) {
  const pageSize = 8
  const votingContract = useVotingContract(votingAddress)
  const lastIdRes = useSingleCallResult(votingContract, 'curId', [])
  const lastId = useMemo(() => (lastIdRes.result ? Number(lastIdRes.result.toString()) : 0), [lastIdRes.result])

  const begin = 1
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = useMemo(() => {
    return lastId ? Math.ceil(lastId - begin + 1 / pageSize) : 0
  }, [lastId, pageSize])

  const ids = useMemo(() => {
    const ret = []
    let index = lastId - (currentPage - 1) * pageSize
    while (index > lastId - currentPage * pageSize && index >= begin) {
      ret.push([index])
      index--
    }
    return ret
  }, [lastId, currentPage, pageSize])

  const proposalMap = useSingleContractMultipleData(votingContract, 'getProposalById', ids)
  const list: (ProposalInfoProp | undefined)[] = proposalMap.map((pro, index) => {
    if (!pro.result || !pro.result[0]) return undefined
    const item = pro.result[0]
    const ret = {
      id: ids[index][0].toString(),
      creator: item.creator,
      proType: item.proType,
      title: item.title,
      content: item.content,
      startTime: Number(item.startTime.toString()),
      endTime: Number(item.endTime.toString()),
      blkHeight: item.blkHeight.toString(),
      status: item.status,
      minimumVote: item.minimumVote.toString(),
      minimumValidVotes: item.minimumValidVotes.toString(),
      minimumCreateProposal: item.minimumCreateProposal.toString()
    }
    // const curTime = getCurrentTimeStamp()
    // if (item.status === 0 && ret.startTime < curTime && ret.endTime > curTime) {
    //   ret.status = ProposalStatusProp.Active
    // }
    // if (item.status <= 1 && ret.endTime < curTime) {
    //   ret.status = ProposalStatusProp.WaitFinish
    // }
    if (item.status === ProposalStatusProp.Success && item.proType === ProposalType.CONTRACT) {
      ret.status = ProposalStatusProp.Executable
    }
    return ret
  })

  return {
    page: {
      total: lastId,
      totalPages,
      currentPage,
      pageSize,
      setCurrentPage
    },
    list,
    loading: lastIdRes.loading || proposalMap?.[0]?.loading || false
  }
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

export function useVoteResults(
  votingAddress: string | undefined,
  proposalId: string
):
  | {
      amount: string
      id: string
      optionIndex: number
    }
  | undefined {
  const { account } = useActiveWeb3React()
  const votingContract = useVotingContract(votingAddress)
  const res = useSingleCallResult(proposalId ? votingContract : null, 'voteResults', [account || undefined, proposalId])
  return res.result
    ? {
        amount: res.result.amount.toString(),
        id: res.result.id.toString(),
        optionIndex: Number(res.result.optionIndex.toString())
      }
    : undefined
}

export function useVotingClaimed(votingAddress: string | undefined, proposalId: string): boolean | undefined {
  const votingContract = useVotingContract(votingAddress)
  const res = useSingleCallResult(proposalId ? votingContract : null, 'claimed', [proposalId])
  return res.result?.[0]
}
