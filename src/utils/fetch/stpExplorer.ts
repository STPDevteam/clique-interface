import { stpExplorerBaseUrl } from '../../constants'
import { Axios } from '../axios'

export function getTokenInfo(tokenAddress: string) {
  return Axios.get(stpExplorerBaseUrl + 'api/token/' + tokenAddress)
}

export function getTokenHolders(tokenAddress: string) {
  return Axios.get(stpExplorerBaseUrl + `api/accounts/${tokenAddress}/holders`)
}

export function getAccountERC20Tokens(accountAddress: string) {
  return Axios.get(stpExplorerBaseUrl + `api/accounts/${accountAddress}/tokens`)
}
