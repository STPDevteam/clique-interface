import { Axios } from '../axios'
import { serverBaseUrl } from '../../constants'

export interface MyAirdropReqProp {
  airdropAmount: string
  airdropTime: number
  mediumLink: string
  tokenContractAddress: string
  tokenLogo: string
  // airdropContractAddress: string
  // tokenDecimals: 0
  // tokenName: 'string'
  // tokenSupply: 0
  // tokenSymbol: 'string'
}

export function myAirdropList(chainId: number, account: string, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `project/${chainId}/${account}/`, {
    pageNum,
    pageSize
  })
}

export function createMyAirdrop(chainId: number, account: string, data: MyAirdropReqProp) {
  return Axios.post(
    serverBaseUrl + `project/${chainId}/${account}/`,
    Object.assign(
      {
        airdropContractAddress: '',
        tokenDecimals: 0,
        tokenName: '',
        tokenSupply: 0,
        tokenSymbol: ''
      },
      data
    )
  )
}

export function editMyAirdrop(id: number, data: MyAirdropReqProp) {
  return Axios.put(
    serverBaseUrl + `project/${id}/`,
    Object.assign(
      {
        airdropContractAddress: '',
        tokenDecimals: 0,
        tokenName: '',
        tokenSupply: 0,
        tokenSymbol: ''
      },
      data
    )
  )
}

export function airdropList(chainId: number, pageNum: number, pageSize: number) {
  return Axios.get(serverBaseUrl + `project/${chainId}/airdrop/`, {
    pageNum,
    pageSize
  })
}
