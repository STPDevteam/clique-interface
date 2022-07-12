import { useEffect, useMemo, useState } from 'react'
import ERC20_INTERFACE, { DAO_ERC20_INTERFACE } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import {
  useCreateERC20Contract,
  useMulticallContract,
  useSTPTokenContract,
  useTokenContract
} from '../../hooks/useContract'
import { getContract, isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData, useSingleCallResult } from '../multicall/hooks'
import { CurrencyAmount, TokenAmount } from '../../constants/token/fractions'
import JSBI from 'jsbi'
import { Currency, ETHER, Token } from '../../constants/token'
import { BAST_TOKEN } from '../../constants'
import { ChainId } from 'constants/chain'
import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'
import ERC20_ABI from 'constants/abis/erc20.json'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()

  const uni = chainId ? BAST_TOKEN[chainId] : undefined

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)

  if (!uni) return undefined

  return uniBalance
}

export function useSTPTokens(
  tokenAddress: (string | undefined)[],
  curChainId?: ChainId
): undefined | (Token | undefined)[] {
  const { chainId } = useActiveWeb3React()

  const tokenNames = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'name')
  const symbols = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'symbol')
  const decimalss = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'decimals')
  const logos = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'logo')

  return useMemo(() => {
    if (!tokenAddress.length) return undefined
    if (!tokenNames.length || !symbols.length || !decimalss.length) return undefined
    if (!chainId && !curChainId) return undefined
    if (tokenNames[0].loading || symbols[0].loading || decimalss[0].loading) return undefined
    return tokenAddress.map((address, index) => {
      const symbol = symbols[index].result
      const tokenName = tokenNames[index].result
      const decimal = decimalss[index].result
      const logo = logos[index].result
      if (!symbol || !tokenName || !decimal || !address) return undefined

      return new Token(curChainId || chainId || 1, address, decimal[0], symbol[0], tokenName[0], logo?.[0] || '')
    })
  }, [chainId, curChainId, decimalss, logos, symbols, tokenAddress, tokenNames])
}

export function useSTPToken(tokenAddress: string | undefined, curChainId?: ChainId): Token | undefined {
  const { chainId } = useActiveWeb3React()
  const tokenContract = useSTPTokenContract(tokenAddress)

  const tokenName = useSingleCallResult(tokenAddress ? tokenContract : null, 'name', [])
  const symbol = useSingleCallResult(tokenAddress ? tokenContract : null, 'symbol', [])
  const decimal = useSingleCallResult(tokenAddress ? tokenContract : null, 'decimals', [])
  const logo = useSingleCallResult(tokenAddress ? tokenContract : null, 'logo', [])

  return useMemo(() => {
    if (!tokenAddress) return undefined
    if (!chainId && !curChainId) return undefined
    if (!tokenName.result || !symbol.result || !decimal.result) return undefined
    return new Token(
      curChainId || chainId || 1,
      tokenAddress,
      decimal.result[0],
      symbol.result[0],
      tokenName.result[0],
      logo.result?.[0] || ''
    )
  }, [chainId, curChainId, decimal.result, logo.result, symbol.result, tokenAddress, tokenName.result])
}

export function useToken(tokenAddress: string | undefined, curChainId?: ChainId): Token | undefined {
  const { chainId } = useActiveWeb3React()
  const tokenContract = useTokenContract(tokenAddress)

  const tokenName = useSingleCallResult(tokenAddress ? tokenContract : null, 'name', [])
  const symbol = useSingleCallResult(tokenAddress ? tokenContract : null, 'symbol', [])
  const decimal = useSingleCallResult(tokenAddress ? tokenContract : null, 'decimals', [])

  return useMemo(() => {
    if (!tokenAddress) return undefined
    if (!chainId && !curChainId) return undefined
    if (!tokenName.result || !symbol.result || !decimal.result) return undefined
    return new Token(curChainId || chainId || 1, tokenAddress, decimal.result[0], symbol.result[0], tokenName.result[0])
  }, [chainId, curChainId, decimal.result, symbol.result, tokenAddress, tokenName.result])
}

export function useTokens(
  tokenAddress: (string | undefined)[],
  curChainId?: ChainId
): undefined | (Token | undefined)[] {
  const { chainId } = useActiveWeb3React()

  const tokenNames = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'name')
  const symbols = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'symbol')
  const decimalss = useMultipleContractSingleData(tokenAddress, DAO_ERC20_INTERFACE, 'decimals')

  return useMemo(() => {
    if (!tokenAddress.length) return undefined
    if (!tokenNames.length || !symbols.length || !decimalss.length) return undefined
    if (!chainId && !curChainId) return undefined
    if (tokenNames[0].loading || symbols[0].loading || decimalss[0].loading) return undefined
    return tokenAddress.map((address, index) => {
      const symbol = symbols[index].result
      const tokenName = tokenNames[index].result
      const decimal = decimalss[index].result
      if (!symbol || !tokenName || !decimal || !address) return undefined

      return new Token(curChainId || chainId || 1, address, decimal[0], symbol[0], tokenName[0])
    })
  }, [chainId, curChainId, decimalss, symbols, tokenAddress, tokenNames])
}

export function useTokenByChain(
  tokenAddress: string | undefined,
  curChainId: ChainId | undefined
):
  | undefined
  | {
      token: Token
      totalSupply: TokenAmount
    } {
  const [name, setName] = useState<string>()
  const [decimals, setDecimals] = useState<number>()
  const [symbol, setSymbol] = useState<string>()
  const [totalSupply, setTotalSupply] = useState<string>()

  const contract = useMemo(() => {
    if (!tokenAddress || !curChainId) return undefined
    const library = getOtherNetworkLibrary(curChainId)
    if (!library) return undefined
    return getContract(tokenAddress, ERC20_ABI, library, undefined)
  }, [curChainId, tokenAddress])

  useEffect(() => {
    if (!contract) {
      setName(undefined)
      setSymbol(undefined)
      setDecimals(undefined)
      return
    }
    contract.name().then((res: string) => setName(res))
    contract.symbol().then((res: string) => setSymbol(res))
    contract.decimals().then((res: number) => setDecimals(res))
    contract.totalSupply().then((res: string) => setTotalSupply(res.toString()))
  }, [contract])

  return useMemo(() => {
    if (!contract || !curChainId || !tokenAddress) return undefined
    if (!name || !symbol || !decimals) return undefined
    const token = new Token(curChainId, tokenAddress, decimals, symbol, name)
    return {
      token,
      totalSupply: new TokenAmount(token, totalSupply || '0')
    }
  }, [contract, curChainId, decimals, name, symbol, tokenAddress, totalSupply])
}

export function useTokenBalanceByChain(
  account: string | undefined,
  tokenAddress: string | undefined,
  curChainId: ChainId | undefined
) {
  const [balance, setBalance] = useState<string>()

  const contract = useMemo(() => {
    if (!tokenAddress || !curChainId) return undefined
    const library = getOtherNetworkLibrary(curChainId)
    if (!library) return undefined
    return getContract(tokenAddress, ERC20_ABI, library, undefined)
  }, [curChainId, tokenAddress])

  useEffect(() => {
    if (!contract) {
      setBalance(undefined)
      return
    }
    contract.balanceOf(account).then((res: string) => setBalance(res.toString()))
  }, [account, contract])

  return balance
}

export function useCreateTokenLogo(tokenAddress: string) {
  const contract = useCreateERC20Contract()
  const logoURLs = useSingleCallResult(tokenAddress ? contract : null, 'logoURLs', [tokenAddress])
  return logoURLs.result?.[0]
}
