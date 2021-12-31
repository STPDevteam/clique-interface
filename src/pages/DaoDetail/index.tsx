import { useState } from 'react'
import styles from './index.module.less'
// import { Button } from 'antd'
import IconLogo from '../../assets/images/token-stpt.png'
import Proposals from './components/Proposals'
import ProposalDetail from './components/ProposalDetail'
import CreateProposal from './components/CreateProposal'
import Assets from './components/Assets'
import Members from './components/Members'
import Configuration from './components/Configuration'
import Copy from 'components/essential/Copy'

export default function Index() {
  const detail = {
    name: 'DAO Test',
    users: 14,
    token: 'DAO Test Coin',
    symbol: 'DTC',
    address: '0x1B94fb7625e13408393B5Ac17D0265E0d61349f2'
  }
  const links = ['Proposal', 'Assets', 'Members', 'Configuration']
  const [currentLink, setCurrentLink] = useState(links[0])
  const [currentProposal, setCurrentProposal] = useState()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className={styles['dao-detail']}>
      <div className={styles['detail-header']}>
        <p className={styles['title']}>{detail.name}</p>
        <p className={styles['text']}>{detail.users} users</p>
        <p>
          Describe the organization in one paragraph,Describe the organization in one paragraph, Describe the
          organization in one paragraph,{' '}
        </p>
        {/* <Button className={'btn-common btn-01'}>Join</Button> */}
      </div>
      {currentProposal && (
        <ProposalDetail
          detail={currentProposal}
          onBack={() => {
            setCurrentProposal(undefined)
          }}
        />
      )}
      {showCreate && (
        <CreateProposal
          onBack={() => {
            setShowCreate(false)
          }}
        />
      )}
      {!showCreate && !currentProposal && (
        <div className={styles['detail-content']}>
          <div className={styles['content-left']}>
            <img src={IconLogo} alt="" className={styles['logo']} />
            <p className={styles['title']}>{detail.token}</p>
            <p className={styles['symbol']}>{detail.symbol}</p>
            <div className={styles['address']}>
              <span>{detail.address.slice(0, 5) + '...' + detail.address.slice(-8)}</span>
              <Copy toCopy={detail.address || ''} />
            </div>
            <ul className={styles['links']}>
              {links.map((item, index) => (
                <li
                  key={index}
                  className={styles[item === currentLink ? 'active-link' : '']}
                  onClick={() => setCurrentLink(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles['content-right']}>
            {currentLink === 'Proposal' && (
              <Proposals onSelect={val => setCurrentProposal(val)} onCreate={() => setShowCreate(true)} />
            )}
            {currentLink === 'Assets' && <Assets />}
            {currentLink === 'Members' && <Members />}
            {currentLink === 'Configuration' && <Configuration />}
          </div>
        </div>
      )}
    </div>
  )
}
