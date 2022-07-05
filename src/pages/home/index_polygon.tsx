import './pc.less'

import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
// import CreateSelectModal from './CreateSelectModal'
// import useModal from 'hooks/useModal'
import { Box, Tooltip, Typography, useTheme } from '@mui/material'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useHistory } from 'react-router-dom'
import { CROSS_SUPPORT_CREATE_NETWORK } from '../../constants'
import addDaoIcon from 'assets/images/add-dao-icon.png'
import createTokenIcon from 'assets/images/create-token-ball.png'
import Image from 'components/Image'

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
          <Typography fontWeight={600} color={theme.palette.text.primary}>
            Add a DAO
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Coming Soon" placement="top">
            <Box
              className="item-create"
              // onClick={() => {
              //   if (!account) {
              //     toggleWalletModal()
              //     return
              //   }
              //   if (chainId && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId)) {
              //     history.replace('/create_token')
              //   } else {
              //     account && triggerSwitchChain(library, SUPPORT_CREATE_TOKEN_NETWORK[0], account)
              //   }
              // }}
            >
              <Image src={createTokenIcon} width={182}></Image>
            </Box>
          </Tooltip>
          <Typography fontWeight={600} color={theme.palette.text.primary}>
            Create a Token
          </Typography>
        </Box>
      </Box>

      <Box className="faq">
        <Typography>Add a DAO with a few clicks</Typography>
        <Typography>
          Add your DAO and set its governance framework running on Polygon through the Ethereum blockchain
        </Typography>
      </Box>
    </main>
  )
}
