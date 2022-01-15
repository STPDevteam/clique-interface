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
      title: 'Membership',
      desc:
        'Use a non-transferrable token to represent membership. Decisions are based on one-member-one-vote governance.',
      onClick: () => history.push('/building/settings/memberShip'),
      action: 'Build'
    },
    {
      icon: icon02,
      title: 'Project DAO',
      desc: 'Initialized a transparent and accountable crowdfunding campaign for your organization.',
      onClick: () => history.push('/building/settings/dao'),
      action: 'Build'
    },
    {
      icon: icon03,
      title: 'Investment',
      desc: 'Initialized a transparent and accountable crowdfunding campaign for your organization.',
      onClick: () => history.push('/building/settings/invest'),
      action: 'Build'
    }
  ]
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <main className="home">
      <h1>Create a DAO within a few minutes</h1>
      <p>
        Build on-chain decentralized organizations and issue governance token running on STP Smart Chain by using
        industry-based templates
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
