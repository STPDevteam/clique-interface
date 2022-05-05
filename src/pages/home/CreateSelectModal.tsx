import { Box, styled, Typography } from '@mui/material'
import Modal from '../../components/Modal'
import { ReactComponent as CreateTokenIcon } from 'assets/svg/create_token_icon.svg'
import { ReactComponent as ExternalTokenIcon } from 'assets/svg/external_token_icon.svg'
import { ReactComponent as CrossTokenIcon } from 'assets/svg/cross_token_icon.svg'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { BASE_DAO_SUPPORT_NETWORK, EXTERNAL_SUPPORT_NETWORK, CROSS_SUPPORT_CREATE_NETWORK } from '../../constants'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const Item = styled(Box)({
  padding: '30px 10px 20px',
  cursor: 'pointer',
  width: '200px',
  height: '180px',
  border: '0.5px solid #D8D8D8',
  background: '#FAFAFA',
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.5s',
  '&:hover': {
    boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.5)'
  }
})

export default function CreateSelectModal({ hide }: { hide: () => void }) {
  const history = useHistory()
  const { chainId, library, account } = useActiveWeb3React()

  return (
    <Modal closeIcon maxWidth={'700px'}>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Select creation method
      </Typography>
      <Box display={'flex'} justifyContent="center" gap={'20px'} padding="40px 10px 10px">
        <Item
          onClick={() => {
            if (!BASE_DAO_SUPPORT_NETWORK.includes(chainId || 0)) {
              account && triggerSwitchChain(library, BASE_DAO_SUPPORT_NETWORK[0], account)
            } else {
              hide()
              history.replace('/building')
            }
          }}
        >
          <Box display={'grid'} gap="24px" justifyItems={'center'} alignItems="center">
            <CreateTokenIcon />
            <Typography variant="body2" textAlign={'center'} fontWeight={500} color="#22304A">
              Create new tokens
            </Typography>
          </Box>
        </Item>
        <Item
          onClick={() => {
            if (chainId && EXTERNAL_SUPPORT_NETWORK.includes(chainId)) {
              hide()
              history.replace('/external_building')
            } else {
              account && triggerSwitchChain(library, EXTERNAL_SUPPORT_NETWORK[0], account)
            }
          }}
        >
          <Box display={'grid'} gap="24px" justifyItems={'center'} alignItems="center">
            <ExternalTokenIcon />
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-word' }}
              textAlign={'center'}
              fontWeight={500}
              color="#22304A"
            >
              External Contracts (Rinkeby)
            </Typography>
          </Box>
        </Item>
        <Item
          onClick={() => {
            if (chainId && CROSS_SUPPORT_CREATE_NETWORK.includes(chainId)) {
              hide()
              history.replace('/cross_building')
            } else {
              account && triggerSwitchChain(library, CROSS_SUPPORT_CREATE_NETWORK[0], account)
            }
          }}
        >
          <Box display={'grid'} gap="24px" justifyItems={'center'} alignItems="center">
            <CrossTokenIcon />
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-word' }}
              textAlign={'center'}
              fontWeight={500}
              color="#22304A"
            >
              Cross-chain Governance (Verse & Polygon)
            </Typography>
          </Box>
        </Item>
      </Box>
    </Modal>
  )
}
