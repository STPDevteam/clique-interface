import { Axios } from '../axios'
import { serverBaseUrl } from '../../constants'

export function queryDaoByTokenAddress(chainId: number, address: string) {
  return Axios.get(serverBaseUrl + `${chainId}/dao/${address}`)
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
