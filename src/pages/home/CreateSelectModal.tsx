import { Box, styled, Typography } from '@mui/material'
import Modal from '../../components/Modal'
import { ReactComponent as CreateTokenIcon } from 'assets/svg/create_token_icon.svg'
import { ReactComponent as ExternalTokenIcon } from 'assets/svg/external_token_icon.svg'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { ChainId } from 'constants/chain'

const Item = styled(Box)({
  padding: '30px 20px 20px',
  cursor: 'pointer',
  width: '160px',
  height: '160px',
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
  const { chainId } = useActiveWeb3React()

  return (
    <Modal closeIcon maxWidth={'650px'}>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Select creation method
      </Typography>
      <Box display={'flex'} justifyContent="center" gap={'20px'} padding="40px 10px 10px">
        <Item
          onClick={() => {
            hide()
            history.push('/building')
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
            if (chainId === ChainId.RINKEBY) {
              hide()
              history.push('/external_building')
            }
          }}
        >
          <Box display={'grid'} gap="24px" justifyItems={'center'} alignItems="center">
            <ExternalTokenIcon />
            <Typography variant="body2" textAlign={'center'} fontWeight={500} color="#22304A">
              External Contracts (Rinkeby)
            </Typography>
          </Box>
        </Item>
        <Item
          onClick={() => {
            if (chainId !== ChainId.STP) {
              hide()
              history.push('/cross_building')
            }
          }}
        >
          <Box display={'grid'} gap="24px" justifyItems={'center'} alignItems="center">
            <ExternalTokenIcon />
            <Typography variant="body2" textAlign={'center'} fontWeight={500} color="#22304A">
              Cross-chain Governance (Verse)
            </Typography>
          </Box>
        </Item>
      </Box>
    </Modal>
  )
}
