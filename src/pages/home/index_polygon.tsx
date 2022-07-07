import './pc.less'

import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
// import CreateSelectModal from './CreateSelectModal'
// import useModal from 'hooks/useModal'
import { Box, Typography, useTheme } from '@mui/material'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useHistory } from 'react-router-dom'
import { CROSS_SUPPORT_CREATE_NETWORK, SUPPORT_CREATE_TOKEN_NETWORK } from '../../constants'
import addDaoIcon from 'assets/images/add-dao-icon.png'
import createTokenIcon from 'assets/images/create-token-ball.png'
import Image from 'components/Image'
import Collapse from 'components/Collapse'

export default function Index() {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  const history = useHistory()
  return (
    <main className="home">
      <Box maxWidth={'100%'} pt={100} width="808px" margin={'auto'} display="flex" justifyContent={'space-between'}>
        <Box>
          <Box
            className="item-create"
            onClick={() => {
              if (!account) {
                toggleWalletModal()
                return
              }
              if (chainId && CROSS_SUPPORT_CREATE_NETWORK.includes(chainId)) {
                history.replace('/cross_building')
              } else {
                account && triggerSwitchChain(library, CROSS_SUPPORT_CREATE_NETWORK[0], account)
              }
            }}
          >
            <Image src={addDaoIcon} width={182}></Image>
          </Box>
          <Typography mt={10} fontWeight={600} color={theme.palette.text.primary}>
            Add a DAO
          </Typography>
        </Box>
        <Box>
          <Box
            className="item-create"
            onClick={() => {
              if (!account) {
                toggleWalletModal()
                return
              }
              if (chainId && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId)) {
                history.replace('/create_token')
              } else {
                account && triggerSwitchChain(library, SUPPORT_CREATE_TOKEN_NETWORK[0], account)
              }
            }}
          >
            <Image src={createTokenIcon} width={182}></Image>
          </Box>
          <Typography mt={10} fontWeight={600} color={theme.palette.text.primary}>
            Create a Token
          </Typography>
        </Box>
      </Box>

      <Box maxWidth={'100%'} pt={50} width="808px" margin={'auto'}>
        <Typography fontWeight={600} fontSize={20} style={{ textAlign: 'left' }}>
          Faq
        </Typography>
        <Box mt={5}>
          <Collapse title={'What does adding a DAO mean?'}>
            It means you are setting up the governance framework for your project here on Clique using a token that
            already exists.
          </Collapse>
          <Collapse title={'What does creating a token mean?'}>
            It means you are creating a new governance token for your DAO right here on Clique. You will be able to
            launch a public sale or airdrop event to distribute the token to your community, which will then facilitate
            governance of your DAO.
          </Collapse>
          <Collapse title={'What tokens can be used as governance tokens?'}>
            Currently we allow any publicly listed token on Ethereum or Polygon to be used as a governance token. For
            tokens that are created here on Clique, you will have the option to choose which chain you would like to
            have your token be on.{' '}
          </Collapse>
        </Box>
      </Box>
    </main>
  )
}
