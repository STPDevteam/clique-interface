import './pc.less'

import { Button } from 'antd'

import icon01 from '../../assets/images/icon-membership.svg'
import icon02 from '../../assets/images/icon-dao.svg'
import icon03 from '../../assets/images/icon-invest.svg'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CreateSelectModal from './CreateSelectModal'
import useModal from 'hooks/useModal'
import { Box } from '@mui/material'
import { ReactComponent as CreateTokenWhiteIcon } from '../../assets/svg/create_token_white_icon.svg'
import { ReactComponent as SelectTokenWhiteIcon } from '../../assets/svg/select_token_white_icon.svg'
import { BASE_DAO_SUPPORT_NETWORK } from '../../constants'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useHistory } from 'react-router-dom'

export default function Index() {
  const cardItems = [
    {
      icon: icon01,
      title: 'Membership DAO',
      desc: 'Issue DAO governance tokens to represent membership and voting power'
      // onClick: () => history.push('/building/settings/memberShip'),
      // action: 'Build'
    },
    {
      icon: icon02,
      title: 'Project DAO',
      desc: 'Launch a project DAO with transparent and accountable crowdfunding and token distribution process'
      // onClick: () => history.push('/building/settings/dao'),
      // action: 'Build'
    },
    {
      icon: icon03,
      title: 'Investment DAO',
      desc: 'Manage investment decisions and fund usage based on community votes'
      // onClick: () => history.push('/building/settings/invest'),
      // action: 'Build'
    }
  ]
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  const { showModal, hideModal } = useModal()
  return (
    <main className="home">
      <h1>Create a DAO within a few clicks</h1>
      <p>
        Build your decentralized autonomous organization and create its governance token running on Polygon through the
        Ethereum blockchain
      </p>
      {account ? (
        <Box display={'flex'} gap="30px">
          <Button
            className="btn-common btn-01 btn-build"
            onClick={() => {
              if (!BASE_DAO_SUPPORT_NETWORK.includes(chainId || 0)) {
                account && triggerSwitchChain(library, BASE_DAO_SUPPORT_NETWORK[0], account)
              } else {
                history.replace('/building')
              }
            }}
          >
            <CreateTokenWhiteIcon />
            Create a DAO and issue a new token
          </Button>
          <Button
            className="btn-common btn-01 btn-build"
            onClick={() => showModal(<CreateSelectModal hide={hideModal} />)}
          >
            <SelectTokenWhiteIcon />
            Create a DAO using an existing token
          </Button>
        </Box>
      ) : (
        <Button className="btn-common btn-01 btn-build" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      )}
      <div className="card-list">
        {cardItems.map(item => (
          <div key={item.title} className="card-item">
            <div className="icon-frame">
              <img src={item.icon} />
            </div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
