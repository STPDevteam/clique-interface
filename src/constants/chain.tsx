import { Chain } from 'models/chain'
// import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
// import EthUrl from 'assets/svg/eth_logo.svg'
import STPSvg from '../assets/images/icon-token.svg'
import { ReactComponent as STPLogo } from '../assets/images/icon-token.svg'

export enum ChainId {
  RINKEBY = 4,
  STP = 72
}

export const ChainList = [
  // {
  //   icon: <ETH />,
  //   logo: EthUrl,
  //   symbol: 'Rinkeby',
  //   name: 'Rinkeby Testnet',
  //   id: ChainId.RINKEBY,
  //   hex: '0x4'
  // },
  {
    icon: <STPLogo />,
    logo: STPSvg,
    symbol: 'Verse',
    name: 'Verse Network',
    id: ChainId.STP,
    hex: '0x48'
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
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.STP]: {
    chainId: '0x48',
    chainName: 'Verse',
    nativeCurrency: {
      name: 'STP',
      symbol: 'STP',
      decimals: 18
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
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  }
}
