import './pc.less'

import { Button } from 'antd'

import icon01 from '../../assets/images/icon-membership.svg'
import icon02 from '../../assets/images/icon-dao.svg'
import icon03 from '../../assets/images/icon-invest.svg'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

export default function Index() {
  const history = useHistory()
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
      title: 'Investment',
      desc: 'Manage investment decisions and fund usage based on community votes'
      // onClick: () => history.push('/building/settings/invest'),
      // action: 'Build'
    }
  ]
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <main className="home">
      <h1>Create a DAO within a few clicks</h1>
      <p>
        Build decentralized automated organization and issue governance token running on Verse and Ethereum blockchain
        within a few clicks.
      </p>
      {account ? (
        <Button className="btn-common btn-01 btn-build" onClick={() => history.push('/building')}>
          Build
        </Button>
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
