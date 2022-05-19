import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'

const MainNetwork = new NetworkConnector({
  urls: { 1: process.env.REACT_APP_NETWORK_URL || 'https://mainnet.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847' }
})
const RopstenNetwork = new NetworkConnector({
  urls: { 3: 'https://ropsten.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52' }
})
const RinkebyNetwork = new NetworkConnector({
  urls: { 4: 'https://rinkeby.infura.io/v3/04dc7cbdfe91444fb5127bff1b3f5516' }
})
const KovanNetwork = new NetworkConnector({
  urls: { 42: 'https://kovan.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52' }
})
const VerseTestNetwork = new NetworkConnector({
  urls: { 72: 'https://test-gearrpc.stp.network' }
})
const KlaytnTestNetwork = new NetworkConnector({
  urls: { 1001: 'https://public-node-api.klaytnapi.com/v1/baobab' }
})
const PolygonTestNetwork = new NetworkConnector({
  urls: { 80001: 'https://matic-mumbai.chainstacklabs.com' }
})

export function getOtherNetworkLibrary(chainId: number) {
  switch (chainId) {
    case 1:
      return new Web3Provider(MainNetwork.provider as any)
    case 3:
      return new Web3Provider(RopstenNetwork.provider as any)
    case 4:
      return new Web3Provider(RinkebyNetwork.provider as any)
    case 42:
      return new Web3Provider(KovanNetwork.provider as any)
    case 72:
      return new Web3Provider(VerseTestNetwork.provider as any)
    case 1001:
      return new Web3Provider(KlaytnTestNetwork.provider as any)
    case 80001:
      return new Web3Provider(PolygonTestNetwork.provider as any)
    default:
      return undefined
  }
}
