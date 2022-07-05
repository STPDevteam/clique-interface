import { Box, Typography } from '@mui/material'
import Modal from '../../Modal'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../../../constants'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { BlackButton } from 'components/Button/Button'

export default function CreatorModal({ hide }: { hide: () => void }) {
  const history = useHistory()
  const { chainId, library, account } = useActiveWeb3React()

  return (
    <Modal closeIcon maxWidth={'510px'}>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Creator
      </Typography>
      <Box display={'grid'} gap={'20px'} padding="40px 10px 10px">
        <BlackButton
          onClick={() => {
            hide()
            history.replace('/create')
          }}
        >
          Create a DAO
        </BlackButton>
        <BlackButton
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
        </BlackButton>
      </Box>
    </Modal>
  )
}
