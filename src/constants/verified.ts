import { ChainId } from './chain'

export const Verified_ADDRESS: { [chainid in ChainId]: { id: number; address: string }[] } = {
  [ChainId.ETH]: [],
  [ChainId.RINKEBY]: [],
  [ChainId.STP]: [],
  [ChainId.KLAYTN_BAOBAB]: [],
  [ChainId.POLYGON_TESTNET]: [],
  [ChainId.MATIC]: []
}
