import { Box, styled, Typography } from '@mui/material'
import Modal from '../../Modal'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../../../constants'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'

const Item = styled(Box)({
  background: '#FFFFFF',
  border: '0.5px solid #D8D8D8',
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  cursor: 'pointer',
  height: 60,
  transition: 'all 0.5s',
  textAlign: 'center',
  lineHeight: '60px',
  '&:hover': {
    background: '#FAFAFA',
    boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.5)'
  }
})

export default function CreatorModal({ hide }: { hide: () => void }) {
  const history = useHistory()
  const { chainId, library, account } = useActiveWeb3React()

  return (
    <Modal closeIcon maxWidth={'510px'}>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Creator
      </Typography>
      <Box display={'grid'} gap={'20px'} padding="40px 10px 10px">
        <Item
          onClick={() => {
            hide()
            history.replace('/create')
          }}
        >
          Create a DAO
        </Item>
        <Item
          onClick={() => {
            if (chainId && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId)) {
              hide()
              history.replace('/create_token')
            } else {
              account && triggerSwitchChain(library, SUPPORT_CREATE_TOKEN_NETWORK[0], account)
            }
          }}
        >
          Create a Token
        </Item>
      </Box>
    </Modal>
  )
}
