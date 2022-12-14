import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.ETH]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.STP]: '0x3CA0453c30AD6644c42B0Ed2183d1f019E1a9520',
  [ChainId.KLAYTN_BAOBAB]: '0xaf64127961e233331ac24e77e6590d8b96c3da76',
  [ChainId.MATIC]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [ChainId.POLYGON_TESTNET]: '0xa72E367726540518e4A3B8157Ef8c3e4DAFa56E7'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
