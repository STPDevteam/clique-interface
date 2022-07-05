import { Box, styled } from '@mui/material'
import Button from 'components/Button/Button'
import { useHistory } from 'react-router-dom'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { CROSS_SUPPORT_CREATE_NETWORK } from '../../constants'
import { ChainId, SUPPORTED_NETWORKS } from '../../constants/chain'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const Wrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.height.header,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 11,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

export default function CheckSwitchChainMask() {
  const history = useHistory()
  const { account, chainId, library } = useActiveWeb3React()
  const curRoute = useMemo(() => history.location.pathname, [history])

  if (!account || !chainId) return null

  if (!CROSS_SUPPORT_CREATE_NETWORK.includes(chainId)) {
    const passRoutes = ['/create_token', '/my_wallet']
    if (!passRoutes.map(a => curRoute.includes(a)).reduce((a, b) => a || b)) {
      return (
        <Wrapper>
          <Button
            width="300px"
            onClick={() => {
              triggerSwitchChain(library, CROSS_SUPPORT_CREATE_NETWORK[0], account)
            }}
          >
            Switch to {SUPPORTED_NETWORKS[CROSS_SUPPORT_CREATE_NETWORK[0] as ChainId]?.chainName}
          </Button>
        </Wrapper>
      )
    }
  }

  return null
}
