import { Token, TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import { useSTPToken, useToken, useTokenByChain, useTokens } from 'state/wallet/hooks'
import {
  useMultipleContractSingleData,
  useSingleCallResult,
  useSingleContractMultipleData
} from '../state/multicall/hooks'
import {
  useDaoContract,
  useExternalDaoContract,
  useDaoFactoryContract,
  useSTPTokenContract,
  useCrossDaoContract
} from './useContract'
import { DAO_INTERFACE } from '../constants/abis/erc20'
import { useProposalNumber } from './useVoting'
import { DefaultChainId, PriceDecimals } from '../constants'
import { BigintIsh } from 'constants/token/constants'
import { tryParseAmount } from 'state/application/hooks'
import { getCurrentTimeStamp } from 'utils/dao'
import { useCurPrivateReceivingTokens } from 'state/building/hooks'
import BigNumber from 'bignumber.js'
import { useTotalSupply } from 'data/TotalSupply'
import { useActiveWeb3React } from 'hooks'
import { Verified_ADDRESS } from 'constants/verified'
import { useCrossTokenInfo } from './useBackedCrossServer'

export function useLastDaoId() {
  const daoFactoryContract = useDaoFactoryContract()
  const lastDaoIdRes = useSingleCallResult(daoFactoryContract, 'curDaoId', [])
  return lastDaoIdRes.result ? Number(lastDaoIdRes.result.toString()) : 0
}

export function useDaoContractAddressById(id: number | undefined): string | undefined {
  const daoFactoryContract = useDaoFactoryContract()
  const daoAddressRes = useSingleCallResult(id ? daoFactoryContract : null, 'daoMap', [id])
  return daoAddressRes.result ? daoAddressRes.result[0] : undefined
}

export function useDaoAddressListByIds(
  ids: number[]
): {
  loading: boolean
  data: (string | undefined)[]
} {
  const daoFactoryContract = useDaoFactoryContract()
  const daoAddressRes = useSingleContractMultipleData(
    ids.length ? daoFactoryContract : null,
    'daoMap',
    ids.map(item => [item])
  )
  return {
    loading: daoAddressRes?.[0]?.loading || false,
    data: daoAddressRes.map(item => item.result?.[0])
  }
}

// dao address
export function useCreatedDao(account: string | undefined): string[] | undefined {
  const daoFactoryContract = useDaoFactoryContract()

  const res = useSingleCallResult(account ? daoFactoryContract : null, 'getCreatedDaoByAddress', [account ?? undefined])

  return res.result ? res.result[0].map((item: string) => item).reverse() : undefined
}

export function useDaoBaseInfoByAddress(
  daoAddress: string | undefined
):
  | {
      daoAddress: string
      daoName: string | undefined
      votingAddress: string | undefined
      proposalNumber: string | undefined
      token: Token | undefined
    }
  | undefined {
  const daoContract = useDaoContract(daoAddress)
  const daoNameRes = useSingleCallResult(daoContract, 'name', [])

  const votingAddressRes = useSingleCallResult(daoContract ?? undefined, 'voting', [])
  const votingAddress: string | undefined = useMemo(() => votingAddressRes.result?.[0], [votingAddressRes])
  const proposalNumber = useProposalNumber(votingAddress, daoAddress)

  const daoTokenRes = useSingleCallResult(daoContract ?? undefined, 'getDaoToken', [])
  const tokenAddress: string | undefined = useMemo(() => daoTokenRes.result?.[0], [daoTokenRes])
  const token = useSTPToken(tokenAddress, DefaultChainId)

  if (!daoAddress) return undefined

  return {
    daoAddress,
    daoName: daoNameRes.result?.[0],
    votingAddress,
    proposalNumber,
    token
  }
}

export interface DaoInfoProps {
  daoAddress: string
  daoName: string | undefined
  daoDesc: string | undefined
  token: Token | undefined
  totalSupply: TokenAmount | undefined
  link: {
    website: string
    twitter: string
    discord: string
  }
  reserved: {
    address: string
    amount: TokenAmount
    lockDate: number
  }[]
  priSale: {
    address: string
    amount: TokenAmount
    price: TokenAmount
  }[]
  pubSale:
    | {
        amount: TokenAmount
        price: TokenAmount
        startTime: number
        endTime: number
        pledgeLimitMin: TokenAmount
        pledgeLimitMax: TokenAmount
      }
    | undefined
  receiveToken: Token | undefined
  pubSoldAmt: TokenAmount | undefined
  votingAddress: string | undefined
  proposalNumber: string | undefined
  introduction: string
  rule:
    | undefined
    | {
        minimumVote: TokenAmount
        minimumCreateProposal: TokenAmount
        minimumValidVotes: TokenAmount
        communityVotingDuration: string
        contractVotingDuration: string
        content: string
      }
  logo: string
}
export interface ExternalDaoInfoProps {
  daoAddress: string
  daoName: string | undefined
  daoDesc: string | undefined
  token: Token | undefined
  totalSupply: TokenAmount | undefined
  link: {
    website: string
    twitter: string
    discord: string
  }
  votingAddress: string | undefined
  proposalNumber: string | undefined
  rule:
    | undefined
    | {
        minimumVote: TokenAmount
        minimumCreateProposal: TokenAmount
        minimumValidVotes: TokenAmount
        communityVotingDuration: string
        contractVotingDuration: string
        content: string
      }
  logo: string
}

export enum DaoTypeStatus {
  PUBLIC = 'Public', //public
  WHITELIST = 'Whitelist', // private
  PRIVATE = 'Private' // reserved
}
export enum DaoOpenStatus {
  COMING_SOON = 'Coming soon',
  ACTIVE = 'Active',
  CLOSE = 'Close'
}
export interface DaoStatusProps {
  typeStatus: DaoTypeStatus
  openStatus: DaoOpenStatus
  pubSoldPer: number
}

export function useDaoStatus(daoInfo: DaoInfoProps | undefined): DaoStatusProps | undefined {
  if (!daoInfo || !daoInfo.pubSale?.amount) return undefined
  let typeStatus: DaoTypeStatus = DaoTypeStatus.PRIVATE
  if (daoInfo.pubSale.amount.greaterThan('0')) {
    typeStatus = DaoTypeStatus.PUBLIC
  } else if (daoInfo.priSale.length) {
    typeStatus = DaoTypeStatus.WHITELIST
  }

  let openStatus: DaoOpenStatus = DaoOpenStatus.COMING_SOON
  const curTimeStamp = getCurrentTimeStamp()
  if (curTimeStamp > daoInfo.pubSale.endTime) {
    openStatus = DaoOpenStatus.CLOSE
  } else if (curTimeStamp >= daoInfo.pubSale.startTime && curTimeStamp <= daoInfo.pubSale.endTime) {
    openStatus = DaoOpenStatus.ACTIVE
  } else {
    openStatus = DaoOpenStatus.COMING_SOON
  }

  const pubSoldPer =
    DaoTypeStatus.PUBLIC !== typeStatus || !daoInfo?.pubSoldAmt || !daoInfo?.pubSale?.amount
      ? 0
      : Number(
          new BigNumber(daoInfo.pubSoldAmt.raw.toString() || 0)
            .dividedBy(daoInfo.pubSale.amount.raw.toString())
            .multipliedBy(100)
            .toFixed(2, 1)
        )

  return {
    typeStatus,
    openStatus,
    pubSoldPer
  }
}

export function useDaoInfoByAddress(daoAddress: string | undefined): DaoInfoProps | undefined {
  const daoContract = useDaoContract(daoAddress)

  const daoNameRes = useSingleCallResult(daoContract, 'name', [])
  const descRes = useSingleCallResult(daoContract, 'desc', [])
  const ruleRes = useSingleCallResult(daoContract, 'getDaoRule', [])
  const websiteRes = useSingleCallResult(daoContract, 'website', [])
  const twitterRes = useSingleCallResult(daoContract, 'twitter', [])
  const discordRes = useSingleCallResult(daoContract, 'discord', [])
  const reservedRes = useSingleCallResult(daoContract, 'getReserved', [])
  const priSaleRes = useSingleCallResult(daoContract, 'getPriSales', [])
  const pubSaleRes = useSingleCallResult(daoContract, 'pubSale', [])
  const introductionRes = useSingleCallResult(daoContract, 'introduction', [])

  const receiveTokenRes = useSingleCallResult(daoContract, 'receiveToken', [])
  const pubSoldAmtRes = useSingleCallResult(daoContract, 'pubSoldAmt', [])

  const votingAddressRes = useSingleCallResult(daoContract ?? undefined, 'voting', [])
  const votingAddress: string | undefined = useMemo(() => votingAddressRes.result?.[0], [votingAddressRes])
  const proposalNumber = useProposalNumber(votingAddress, daoAddress)

  const daoTokenRes = useSingleCallResult(daoContract ?? undefined, 'getDaoToken', [])
  const tokenAddress: string | undefined = useMemo(() => daoTokenRes.result?.[0] || undefined, [daoTokenRes])
  const token = useSTPToken(tokenAddress, DefaultChainId)
  const tokenContract = useSTPTokenContract(tokenAddress)

  const tokenLogoRes = useSingleCallResult(daoContract, 'tokenLogo')

  const totalSupplyRes = useSingleCallResult(tokenContract, 'totalSupply', [])
  const totalSupply = useMemo(() => {
    if (!totalSupplyRes.result?.[0] || !token) return undefined
    return new TokenAmount(token, totalSupplyRes.result[0].toString())
  }, [token, totalSupplyRes.result])
  const curPrivateReceivingTokens = useCurPrivateReceivingTokens()

  const receiveToken = useMemo(() => {
    if (!receiveTokenRes.result || !curPrivateReceivingTokens.length) return undefined
    let _cur = curPrivateReceivingTokens[0]
    for (const item of curPrivateReceivingTokens) {
      if (receiveTokenRes.result?.[0] === item.address) {
        _cur = item
        break
      }
    }
    return new Token(_cur.chainId, _cur.address, _cur.decimals, _cur.name, _cur.name, _cur.logo)
  }, [curPrivateReceivingTokens, receiveTokenRes.result])

  const reserved = useMemo(
    () =>
      (token &&
        reservedRes.result?.[0].map((item: { to: any; amount: BigintIsh; lockDate: any }) => {
          return {
            address: item.to,
            amount: new TokenAmount(token, item.amount.toString()),
            lockDate: Number(item.lockDate.toString())
          }
        })) ||
      [],
    [reservedRes.result, token]
  )

  // special price decimals
  const stptPriceToken = useMemo(
    () => (receiveToken ? new Token(receiveToken.chainId, receiveToken.address, PriceDecimals) : undefined),
    [receiveToken]
  )

  const priSale: {
    address: string
    amount: TokenAmount
    price: TokenAmount
  }[] = useMemo(
    () =>
      (receiveToken &&
        token &&
        stptPriceToken &&
        priSaleRes.result?.[0].map(
          (item: { to: any; amount: { toString: () => BigintIsh }; price: { toString: () => BigintIsh } }) => {
            const curPrice = tryParseAmount(
              new TokenAmount(stptPriceToken, item.price.toString()).toSignificant(),
              receiveToken
            )
            return {
              address: item.to,
              amount: new TokenAmount(token, item.amount.toString()),
              price: curPrice as TokenAmount
            }
          }
        )) ||
      [],
    [priSaleRes.result, receiveToken, stptPriceToken, token]
  )

  const rule = useMemo(() => {
    if (!ruleRes.result || !token) return undefined
    const {
      minimumVote,
      minimumCreateProposal,
      minimumValidVotes,
      communityVotingDuration,
      contractVotingDuration,
      content
    } = ruleRes.result[0]
    return {
      minimumVote: new TokenAmount(token, minimumVote.toString()),
      minimumCreateProposal: new TokenAmount(token, minimumCreateProposal.toString()),
      minimumValidVotes: new TokenAmount(token, minimumValidVotes.toString()),
      communityVotingDuration: communityVotingDuration.toString(),
      contractVotingDuration: contractVotingDuration.toString(),
      content: content.toString()
    }
  }, [ruleRes.result, token])

  const pubSale = useMemo(() => {
    const _pub = pubSaleRes.result
    if (!_pub || !token || !receiveToken || !stptPriceToken) return undefined
    // price decimals handler
    const curPrice = tryParseAmount(
      new TokenAmount(stptPriceToken, _pub.price.toString()).toSignificant(),
      receiveToken
    )
    return {
      amount: new TokenAmount(token, _pub.amount),
      price: curPrice as TokenAmount,
      startTime: Number(_pub.startTime),
      endTime: Number(_pub.endTime),
      pledgeLimitMin: new TokenAmount(token, _pub.pledgeLimitMin),
      pledgeLimitMax: new TokenAmount(token, _pub.pledgeLimitMax)
    }
  }, [pubSaleRes.result, receiveToken, stptPriceToken, token])

  const pubSoldAmt = useMemo(() => {
    if (!token) return undefined
    const _ret = pubSoldAmtRes.result?.[0].toString() || '0'
    return new TokenAmount(token, _ret)
  }, [pubSoldAmtRes.result, token])

  if (!daoAddress) return undefined

  return {
    daoAddress,
    daoName: daoNameRes.result?.[0],
    daoDesc: descRes.result?.[0],
    totalSupply,
    link: {
      website: websiteRes.result?.[0] || '',
      twitter: twitterRes.result?.[0] || '',
      discord: discordRes.result?.[0] || ''
    },
    reserved,
    priSale,
    pubSale,
    introduction: introductionRes.result?.[0] || '',
    receiveToken,
    pubSoldAmt,
    votingAddress,
    proposalNumber,
    token,
    rule,
    logo: tokenLogoRes.result?.[0] || ''
  }
}

export function useMultiDaoBaseInfo(
  addresss: (string | undefined)[]
): {
  loading: boolean
  data: {
    daoAddress: string | undefined
    daoName: string | undefined
    votingAddress: string | undefined
    token: Token | undefined
    logo: string | undefined
  }[]
} {
  const daoNameRes = useMultipleContractSingleData(addresss, DAO_INTERFACE, 'name')
  const daoNames = useMemo(() => daoNameRes.map(item => item.result?.[0]), [daoNameRes])

  const votingAddressRes = useMultipleContractSingleData(addresss, DAO_INTERFACE, 'voting')
  const votingAddresss: (string | undefined)[] = useMemo(() => votingAddressRes.map(item => item.result?.[0]), [
    votingAddressRes
  ])

  const tokenLogoRes = useMultipleContractSingleData(addresss, DAO_INTERFACE, 'tokenLogo')
  const tokenLogos: (string | undefined)[] = useMemo(() => tokenLogoRes.map(item => item.result?.[0]), [tokenLogoRes])

  const daoTokenRes = useMultipleContractSingleData(addresss, DAO_INTERFACE, 'getDaoToken')
  const tokenAddresss: (string | undefined)[] = useMemo(() => daoTokenRes.map(item => item.result?.[0]), [daoTokenRes])
  const tokens = useTokens(tokenAddresss, DefaultChainId)

  const data = useMemo(() => {
    return daoNames.map((item, index) => {
      return {
        daoAddress: addresss[index],
        daoName: item,
        votingAddress: votingAddresss[index],
        token: tokens ? tokens[index] : undefined,
        logo: tokenLogos ? tokenLogos[index] : ''
      }
    })
  }, [addresss, daoNames, tokens, votingAddresss, tokenLogos])

  return {
    loading: daoNameRes?.[0]?.loading || false,
    data
  }
}

export enum DaoTypeProp {
  RawDao = '0',
  ExternalDao = '1',
  CrossGovDao = '2'
}

export function useGetDaoType(daoAddress: string | undefined): undefined | DaoTypeProp {
  const contract = useDaoFactoryContract()
  const res = useSingleCallResult(daoAddress ? contract : null, 'getDaoType', [daoAddress])
  return res.result?.[0].toString()
}

export function useGetDaoTypes(daoAddresss: string[] | undefined) {
  const contract = useDaoFactoryContract()
  const res = useSingleContractMultipleData(
    daoAddresss && daoAddresss.length ? contract : null,
    'getDaoType',
    daoAddresss && daoAddresss.length ? daoAddresss.map(i => [i]) : []
  )

  const ret: (undefined | DaoTypeProp)[] = useMemo(() => {
    return res.map(item => item.result?.[0].toString())
  }, [res])

  return {
    loading: daoAddresss && daoAddresss.length ? res[0].loading : false,
    data: ret
  }
}

export function useExternalDaoInfoByAddress(daoAddress: string | undefined): ExternalDaoInfoProps | undefined {
  const daoContract = useExternalDaoContract(daoAddress)

  const daoNameRes = useSingleCallResult(daoContract, 'name', [])
  const descRes = useSingleCallResult(daoContract, 'desc', [])
  const ruleRes = useSingleCallResult(daoContract, 'getDaoRule', [])
  const websiteRes = useSingleCallResult(daoContract, 'website', [])
  const twitterRes = useSingleCallResult(daoContract, 'twitter', [])
  const discordRes = useSingleCallResult(daoContract, 'discord', [])

  const votingAddressRes = useSingleCallResult(daoContract ?? undefined, 'voting', [])
  const votingAddress: string | undefined = useMemo(() => votingAddressRes.result?.[0], [votingAddressRes])
  const proposalNumber = useProposalNumber(votingAddress, daoAddress)

  const daoTokenRes = useSingleCallResult(daoContract ?? undefined, 'getDaoToken', [])
  const tokenAddress: string | undefined = useMemo(() => daoTokenRes.result?.[0] || undefined, [daoTokenRes])
  const token = useToken(tokenAddress, DefaultChainId)
  const totalSupply = useTotalSupply(token)

  const tokenLogoRes = useSingleCallResult(daoContract, 'tokenLogo')

  const rule = useMemo(() => {
    if (!ruleRes.result || !token) return undefined
    const {
      minimumVote,
      minimumCreateProposal,
      minimumValidVotes,
      communityVotingDuration,
      contractVotingDuration,
      content
    } = ruleRes.result[0]
    return {
      minimumVote: new TokenAmount(token, minimumVote.toString()),
      minimumCreateProposal: new TokenAmount(token, minimumCreateProposal.toString()),
      minimumValidVotes: new TokenAmount(token, minimumValidVotes.toString()),
      communityVotingDuration: communityVotingDuration.toString(),
      contractVotingDuration: contractVotingDuration.toString(),
      content: content.toString()
    }
  }, [ruleRes.result, token])

  if (!daoAddress) return undefined

  return {
    daoAddress,
    daoName: daoNameRes.result?.[0],
    daoDesc: descRes.result?.[0],
    totalSupply,
    link: {
      website: websiteRes.result?.[0] || '',
      twitter: twitterRes.result?.[0] || '',
      discord: discordRes.result?.[0] || ''
    },
    votingAddress,
    proposalNumber,
    token,
    rule,
    logo: tokenLogoRes.result?.[0] || ''
  }
}

export function useIsVerifiedDao(address: string | undefined) {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId || !address) return false
    if (!Verified_ADDRESS[chainId] || !Verified_ADDRESS[chainId].length) return false
    return Verified_ADDRESS[chainId].map(({ address }) => address).includes(address)
  }, [address, chainId])
}

export function useCrossDaoInfoByAddress(daoAddress: string | undefined): ExternalDaoInfoProps | undefined {
  const daoContract = useCrossDaoContract(daoAddress)

  const daoNameRes = useSingleCallResult(daoContract, 'name', [])
  const descRes = useSingleCallResult(daoContract, 'desc', [])
  const ruleRes = useSingleCallResult(daoContract, 'getDaoRule', [])
  const websiteRes = useSingleCallResult(daoContract, 'website', [])
  const twitterRes = useSingleCallResult(daoContract, 'twitter', [])
  const discordRes = useSingleCallResult(daoContract, 'discord', [])

  const votingAddressRes = useSingleCallResult(daoContract ?? undefined, 'voting', [])
  const votingAddress: string | undefined = useMemo(() => votingAddressRes.result?.[0], [votingAddressRes])
  const proposalNumber = useProposalNumber(votingAddress, daoAddress)

  const _token = useCrossTokenInfo(daoAddress, votingAddress)
  // const tokenInfo = useTokenByChain('0x86029a4deD57C14Bb8620ED177F3B2a4D300C040', 4)
  const tokenInfo = useTokenByChain(_token.tokenAddress, _token.chainId)

  const tokenLogoRes = useSingleCallResult(daoContract, 'tokenLogo')

  const rule = useMemo(() => {
    if (!ruleRes.result || !tokenInfo?.token) return undefined
    const {
      minimumVote,
      minimumCreateProposal,
      minimumValidVotes,
      communityVotingDuration,
      contractVotingDuration,
      content
    } = ruleRes.result[0]
    return {
      minimumVote: new TokenAmount(tokenInfo.token, minimumVote.toString()),
      minimumCreateProposal: new TokenAmount(tokenInfo.token, minimumCreateProposal.toString()),
      minimumValidVotes: new TokenAmount(tokenInfo.token, minimumValidVotes.toString()),
      communityVotingDuration: communityVotingDuration.toString(),
      contractVotingDuration: contractVotingDuration.toString(),
      content: content.toString()
    }
  }, [ruleRes.result, tokenInfo?.token])

  if (!daoAddress) return undefined

  return {
    daoAddress,
    daoName: daoNameRes.result?.[0],
    daoDesc: descRes.result?.[0],
    totalSupply: tokenInfo?.totalSupply,
    link: {
      website: websiteRes.result?.[0] || '',
      twitter: twitterRes.result?.[0] || '',
      discord: discordRes.result?.[0] || ''
    },
    votingAddress,
    proposalNumber,
    token: tokenInfo?.token,
    rule,
    logo: tokenLogoRes.result?.[0] || ''
  }
}
