import { Axios } from '../axios'

export function faucetClaimTT(chainId: number, address: string) {
  return Axios.get('https://testapi.daoframe.com/' + chainId + '/faucet', {
    address,
    test: true
  })
}
