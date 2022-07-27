import { Contract } from '@ethersproject/contracts'
import ANTIMATTER_ABI from '../constants/abis/antimatter.json'
import { useMemo } from 'react'
import {
  CREATE_TOKEN_ADDRESS,
  DAO_FACTORY_ADDRESS,
  DAO_VERIFIER_ADDRESS,
  FARM_STAKING_ADDRESS,
  SUPPORT_CREATE_TOKEN_NETWORK
} from '../constants'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { ChainId, IS_TEST_ENV } from '../constants/chain'
import DAO_FACTORY_ABI from '../constants/abis/DAOFactory.json'
import DAO_ABI from '../constants/abis/DAO.json'
import STP_TOKEN_ABI from '../constants/abis/DAOToken.json'
import VOTING_ABI from '../constants/abis/voting.json'
import DAO_VERIFIER_ABI from '../constants/abis/DAOVerifier.json'
import ExternalDAO_ABI from '../constants/abis/ExternalDAO.json'
import ExternalToken_ABI from '../constants/abis/ExternalToken.json'
import ExternalVoting_ABI from '../constants/abis/ExternalVoting.json'
import CrossDAO_ABI from '../constants/abis/CrossDAO.json'
import CrossVoting_ABI from '../constants/abis/CrossVoting.json'
import FARM_STAKING_ABI from '../constants/abis/farm_staking.json'
import CREATE_TOKEN_ABI from '../constants/abis/create_token.json'
import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
  queryChainId?: ChainId
): Contract | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI) return null
    if (!queryChainId && !chainId) return null

    if (queryChainId && chainId !== queryChainId) {
      const web3Library = getOtherNetworkLibrary(queryChainId)
      if (!web3Library) return null
      try {
        return getContract(address, ABI, web3Library, undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }
    if (chainId && library) {
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }
    return null
  }, [ABI, account, address, chainId, library, queryChainId, withSignerIfPossible])
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    queryChainId || chainId ? MULTICALL_NETWORKS[(queryChainId || chainId) as ChainId] : undefined,
    MULTICALL_ABI,
    undefined,
    queryChainId
  )
}

export function useCallOrPutContract(address: string): Contract | null {
  return useContract(address, ANTIMATTER_ABI, true)
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.STP ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}

export function useDaoFactoryContract(queryChainId?: ChainId): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId || queryChainId ? DAO_FACTORY_ADDRESS[(queryChainId || chainId) as ChainId] : undefined,
    DAO_FACTORY_ABI,
    true,
    queryChainId
  )
}

export function useDaoContract(daoAddress: string | undefined): Contract | null {
  return useContract(daoAddress, DAO_ABI, true)
}

export function useVotingContract(votingAddress: string | undefined): Contract | null {
  return useContract(votingAddress, VOTING_ABI, true)
}

export function useSTPTokenContract(tokenAddress: string | undefined): Contract | null {
  return useContract(tokenAddress, STP_TOKEN_ABI, true)
}

export function useExternalDaoContract(daoAddress: string | undefined): Contract | null {
  return useContract(daoAddress, ExternalDAO_ABI, true)
}
export function useCrossDaoContract(daoAddress: string | undefined, chainId?: ChainId): Contract | null {
  return useContract(daoAddress, CrossDAO_ABI, true, chainId)
}

export function useExternalVotingContract(votingAddress: string | undefined): Contract | null {
  return useContract(votingAddress, ExternalVoting_ABI, true)
}

export function useExternalTokenContract(tokenAddress: string | undefined): Contract | null {
  return useContract(tokenAddress, ExternalToken_ABI, true)
}

export function useFarmStakingContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId && ChainId.RINKEBY === chainId ? FARM_STAKING_ADDRESS[chainId] : undefined,
    FARM_STAKING_ABI,
    true
  )
}

export function useCrossVotingContract(votingAddress: string | undefined): Contract | null {
  return useContract(votingAddress, CrossVoting_ABI, true)
}

export function useCreateERC20Contract(): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(
    chainId && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId) ? CREATE_TOKEN_ADDRESS[chainId] : undefined,
    CREATE_TOKEN_ABI,
    true
  )
}

export function useCrossDaoVerifierContract(): Contract | null {
  const chainId = IS_TEST_ENV ? ChainId.RINKEBY : ChainId.ETH
  const address = DAO_VERIFIER_ADDRESS[chainId]
  return useContract(address, DAO_VERIFIER_ABI, true, chainId)
}

export function useCrossDaoContractForPolygon(daoAddress: string | undefined) {
  const chainId = IS_TEST_ENV ? ChainId.POLYGON_TESTNET : ChainId.MATIC
  return useCrossDaoContract(daoAddress, chainId)
}
