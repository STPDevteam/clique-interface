import { MenuItem, Box } from '@mui/material'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'
import { useActiveWeb3React } from 'hooks'
import { ChainId, ChainList, SUPPORTED_NETWORKS } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { useWalletModalToggle } from 'state/application/hooks'

export default function NetworkSelect() {
  const { chainId, account, library } = useActiveWeb3React()
  const isDownSm = useBreakpoint('sm')
  const toggleWalletModal = useWalletModalToggle()

  // if (!chainId || !account) return null

  return (
    <Box>
      <Select
        defaultValue={chainId}
        value={chainId}
        width={isDownSm ? 'max-content' : '180px'}
        height={isDownSm ? '36px' : '50px'}
        style={{
          '& .Mui-disabled.MuiSelect-select.MuiInputBase-input': {
            paddingRight: isDownSm ? 0 : 10,
            color: theme => theme.palette.text.primary,
            WebkitTextFillColor: theme => theme.palette.text.primary
          }
        }}
      >
        {ChainList.map(option => (
          <MenuItem
            onClick={() => {
              if (!chainId || !library || !account) {
                toggleWalletModal()
                return
              }
              if (Object.values(ChainId).includes(option.id)) {
                library?.send('wallet_switchEthereumChain', [
                  { chainId: SUPPORTED_NETWORKS[option.id as ChainId]?.chainId },
                  account
                ])
              } else {
                const params = SUPPORTED_NETWORKS[option.id as ChainId]
                library?.send('wallet_addEthereumChain', [params, account])
              }
            }}
            value={option.id}
            key={option.id}
            selected={chainId === option.id}
          >
            {isDownSm ? (
              <Image src={option.logo} style={{ height: 14, width: 'auto', margin: '5px 0 0' }} />
            ) : (
              <LogoText logo={option.logo} text={option.symbol} gapSize={'small'} fontSize={14} />
            )}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
