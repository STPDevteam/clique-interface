import { Axios } from '../axios'
import { serverBaseUrl } from '../../constants'

export function queryDaoByTokenAddress(chainId: number, address: string) {
  return Axios.get(serverBaseUrl + `${chainId}/dao/${address}`)
}

export function commitErrorMsg(title: string, content: string, func: string, params: string) {
  return Axios.post(serverBaseUrl + 'error', {
    title,
    content,
    func,
    params
  })
}

export function uploadPictureAddress() {
  return serverBaseUrl + 'upload'
}

export function getAssetsTransferRecord(chainId: number, address: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `${chainId}/assets/${address}`, {
    pageNum,
    pageSize
  })
}

export function getProposalStatusDateline(chainId: number, proposalId: string, votingAddress: string) {
  return Axios.get(serverBaseUrl + `${chainId}/proposal/${votingAddress}/${proposalId}`)
}

export function getWithdrawReservedList(chainId: number, daoAddress: string) {
  return Axios.get(serverBaseUrl + `${chainId}/withdrawReserved/${daoAddress}`)
}

export function getPriPubSwapList(chainId: number, daoAddress: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `${chainId}/swap/${daoAddress}`, {
    pageNum,
    pageSize
  })
}

export function getMyWalletHistory(chainId: number, accountAddress: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `${chainId}/wallet/${accountAddress}`, {
    pageNum,
    pageSize
  })
}

export function getProposalVoteList(
  chainId: number,
  proposalId: string,
  votingAddress: string,
  pageNum: number,
  pageSize: number
) {
  return Axios.get(serverBaseUrl + `${chainId}/vote/${votingAddress}/${proposalId}`, {
    pageNum,
    pageSize
  })
}

export function getDaoMembers(chainId: number, daoTokenAddress: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `${chainId}/member/${daoTokenAddress}`, {
    pageNum,
    pageSize
  })
}

export function getAccountDaoHolds(chainId: number, account: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `${chainId}/hold/${account}`, {
    pageNum,
    pageSize
  })
}

export function getCreateProposalSign(chainId: number, targetChainId: number, daoAddress: string, userAddress: string) {
  return Axios.get(serverBaseUrl + `${chainId}/sign/createProposal/${targetChainId}`, {
    daoAddress,
    userAddress
  })
}

export function getCrossVotingSign(
  chainId: number,
  targetChainId: number,
  daoAddress: string,
  userAddress: string,
  proposalId: number
) {
  return Axios.get(serverBaseUrl + `${chainId}/sign/voting/${targetChainId}`, {
    daoAddress,
    userAddress,
    proposalId
  })
}

export function getCrossTokenInfo(daoAddress: string) {
  return Axios.get(serverBaseUrl + `dao/${daoAddress}`)
}

export function getCrossBalance(
  chainId: number,
  targetChainId: number,
  daoAddress: string,
  userAddress: string,
  proposalId: number | string
) {
  return Axios.get(serverBaseUrl + `${chainId}/balance/${targetChainId}`, {
    daoAddress,
    userAddress,
    proposalId
  })
}

export function getCrossProBlockNum(
  chainId: number,
  targetChainId: number,
  daoAddress: string,
  proposalId: number | string
) {
  return Axios.get(serverBaseUrl + `${chainId}/${targetChainId}/blocknum`, {
    daoAddress,
    proposalId
  })
}

export function commitProposalText(input: string) {
  return Axios.post(serverBaseUrl + 'text', {
    input
  })
}

export function getProposalText(url: string) {
  return Axios.get(url)
}
