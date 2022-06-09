import { ChainId } from './chain'

export const Verified_ADDRESS: { [chainid in ChainId]: { id: number; address: string }[] } = {
  [ChainId.ETH]: [],
  [ChainId.RINKEBY]: [],
  [ChainId.STP]: [],
  [ChainId.KLAYTN_BAOBAB]: [],
  [ChainId.POLYGON_TESTNET]: [],
  [ChainId.MATIC]: [
    { id: 4, address: '0x31e7B9aF1643e96437d9DC49d3c546620A063FEC' },
    { id: 3, address: '0xbc61E252c79D76D9Eb23DAE0E524E80dBA6E54B4' },
    { id: 2, address: '0x53760E38B28d6882Ccf21151417Bc942E2300D00' },
    { id: 1, address: '0x9a151fAaca125f344E30BE6c9deF867a53a1e824' }
  ]
}
