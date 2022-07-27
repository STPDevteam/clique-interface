import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

const MainNetwork = new NetworkConnector({
  urls: {
    [ChainId.ETH]: 'https://mainnet.infura.io/v3/169a2f10743f4afdaa0a17e148552867'
  }
})
const RinkebyNetwork = new NetworkConnector({
  urls: {
    [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/d6f8f688cda54a7aade4e8e4d8ece89b'
  }
})

export function getOtherNetworkLibrary(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETH:
      return new Web3Provider(MainNetwork.provider as any)
    case ChainId.RINKEBY:
      return new Web3Provider(RinkebyNetwork.provider as any)
    default:
      if (SUPPORTED_NETWORKS?.[chainId]?.rpcUrls.length) {
        const network = new NetworkConnector({
          urls: {
            [chainId]: SUPPORTED_NETWORKS[chainId]?.rpcUrls[0] || ''
          }
        })
        return new Web3Provider(network.provider as any)
      }
      return undefined
  }
}
