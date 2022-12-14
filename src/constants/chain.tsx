import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import STPSvg from '../assets/images/icon-token.svg'
import { ReactComponent as STPLogo } from '../assets/images/icon-token.svg'
import MaticSvg from '../assets/svg/matic.svg'
import { ReactComponent as MaticLogo } from '../assets/svg/matic.svg'
import KlaytnSvg from '../assets/svg/klaytn_logo.svg'
import { ReactComponent as KlaytnLogo } from '../assets/svg/klaytn_logo.svg'

export const IS_TEST_ENV = false
export const SUPPORTED_CHAIN_IDS = IS_TEST_ENV ? [80001, 4] : [137, 1]

export enum ChainId {
  ETH = 1,
  RINKEBY = 4,
  STP = 72,
  KLAYTN_BAOBAB = 1001,
  MATIC = 137,
  POLYGON_TESTNET = 80001
}

export const AllChainList = [
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'ETH',
    name: 'Ethereum Mainnet',
    id: ChainId.ETH,
    hex: '0x1'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Rinkeby',
    name: 'Rinkeby Testnet',
    id: ChainId.RINKEBY,
    hex: '0x4'
  },
  {
    icon: <STPLogo />,
    logo: STPSvg,
    symbol: 'Verse',
    name: 'Verse Network',
    id: ChainId.STP,
    hex: '0x48'
  },
  {
    icon: <KlaytnLogo />,
    logo: KlaytnSvg,
    symbol: 'Klaytn Baobab',
    name: 'Klaytn Baobab',
    id: ChainId.KLAYTN_BAOBAB,
    hex: '0x3e9'
  },
  {
    icon: <MaticLogo />,
    logo: MaticSvg,
    symbol: 'Polygon Testnet',
    name: 'Polygon Testnet',
    id: ChainId.POLYGON_TESTNET,
    hex: '0x13881'
  },
  {
    icon: <MaticLogo />,
    logo: MaticSvg,
    symbol: 'Polygon',
    name: 'Polygon',
    id: ChainId.MATIC,
    hex: '0x89'
  }
]

export const ChainList = AllChainList.filter(v => SUPPORTED_CHAIN_IDS.includes(v.id))

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
  [ChainId.ETH]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logo: EthUrl
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
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
  },
  [ChainId.POLYGON_TESTNET]: {
    chainId: '0x13881',
    chainName: 'Polygon Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      logo: MaticSvg
    },
    rpcUrls: ['https://rpc.ankr.com/polygon_mumbai'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      logo: MaticSvg
    },
    rpcUrls: ['https://rpc.ankr.com/polygon'],
    blockExplorerUrls: ['https://polygonscan.com/']
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
    rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
    blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
  }
}
