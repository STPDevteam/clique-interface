import { ChainId } from './chain'

export const Verified_ADDRESS: { [chainid in ChainId]: string[] } = {
  [ChainId.ETH]: [],
  [ChainId.RINKEBY]: ['0xCeDFe513eab8d77A11141e143Eb232e261De4aa3'],
  [ChainId.STP]: [],
  [ChainId.KLAYTN_BAOBAB]: [],
  [ChainId.POLYGON_TESTNET]: [],
  [ChainId.MATIC]: []
}
