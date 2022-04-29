import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import STPSvg from '../assets/images/icon-token.svg'
// import { ReactComponent as STPLogo } from '../assets/images/icon-token.svg'
import KlaytnSvg from '../assets/svg/klaytn_logo.svg'
import { ReactComponent as KlaytnLogo } from '../assets/svg/klaytn_logo.svg'

export enum ChainId {
  RINKEBY = 4,
  STP = 72,
  KLAYTN_BAOBAB = 1001
}

export const ChainList = [
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Rinkeby',
    name: 'Rinkeby Testnet',
    id: ChainId.RINKEBY,
    hex: '0x4'
  },
  // {
  //   icon: <STPLogo />,
  //   logo: STPSvg,
  //   symbol: 'Verse',
  //   name: 'Verse Network',
  //   id: ChainId.STP,
  //   hex: '0x48'
  // },
  {
    icon: <KlaytnLogo />,
    logo: KlaytnSvg,
    symbol: 'Klaytn Baobab',
    name: 'Klaytn Baobab',
    id: ChainId.KLAYTN_BAOBAB,
    hex: '0x3e9'
  }
]

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
      logo: string
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.STP]: {
    chainId: '0x48',
    chainName: 'Verse',
    nativeCurrency: {
      name: 'STPT',
      symbol: 'STPT',
      decimals: 18,
      logo: STPSvg
    },
    rpcUrls: ['https://test-gearrpc.stp.network'],
    blockExplorerUrls: ['https://testnet-explorer.stp.network/']
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'ETH',
      decimals: 18,
      logo: EthUrl
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  },
  [ChainId.KLAYTN_BAOBAB]: {
    chainId: '0x3e9',
    chainName: 'Klaytn Baobab',
    nativeCurrency: {
      name: 'Klaytn Baobab',
      symbol: 'KLAY',
      decimals: 18,
      logo: KlaytnSvg
    },
    rpcUrls: ['https://public-node-api.klaytnapi.com/v1/baobab'],
    blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
  }
}
