import './pc.less'

import { Button } from 'antd'

import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
// import CreateSelectModal from './CreateSelectModal'
// import useModal from 'hooks/useModal'
import { Box } from '@mui/material'
import { ReactComponent as SelectTokenWhiteIcon } from '../../assets/svg/select_token_white_icon.svg'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useHistory } from 'react-router-dom'
import { CROSS_SUPPORT_CREATE_NETWORK } from '../../constants'

export default function Index() {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  return (
    <main className="home">
      <h1>Create a DAO within a few clicks</h1>
      <p>
        Build your decentralized autonomous organization and create its governance token running on Polygon through the
        Ethereum blockchain
      </p>
      {account ? (
        <>
          {/* <Button
            className="btn-common btn-01 btn-build"
            // onClick={() => showModal(<CreateSelectModal hide={hideModal} />)}
            onClick={() => history.push('/building')}
          >
            Build
          </Button> */}
          <Box display={'flex'} gap="30px" justifyContent={'center'}>
            <Button
              className="btn-common btn-01 btn-build"
              onClick={() => {
                if (chainId && CROSS_SUPPORT_CREATE_NETWORK.includes(chainId)) {
                  history.replace('/cross_building')
                } else {
                  account && triggerSwitchChain(library, CROSS_SUPPORT_CREATE_NETWORK[0], account)
                }
              }}
            >
              <SelectTokenWhiteIcon />
              Create a DAO using an existing token
            </Button>
          </Box>
        </>
      ) : (
        <Button className="btn-common btn-01 btn-build" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      )}
    </main>
  )
}
