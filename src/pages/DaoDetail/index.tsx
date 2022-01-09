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
import { useDaoInfoByAddress } from 'hooks/useDAOInfo'
import { useParams } from 'react-router-dom'
import { shortenAddress } from 'utils'
import { ProposalInfoProp } from 'hooks/useVoting'

export default function Index() {
  const links = ['Proposal', 'Assets', 'Members', 'Configuration']
  const { address: daoAddress } = useParams<{ address: string }>()

  const [currentLink, setCurrentLink] = useState(links[0])
  const [currentProposal, setCurrentProposal] = useState<ProposalInfoProp>()
  const [showCreate, setShowCreate] = useState(false)
  const daoInfo = useDaoInfoByAddress(daoAddress)

  return (
    <div className={styles['dao-detail']}>
      <div className={styles['detail-header']}>
        <p className={styles['title']}>{daoInfo?.daoName || '--'}</p>
        <p className={styles['text']}> - Holders</p>
        <p>{daoInfo?.daoDesc}</p>
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
          daoInfo={daoInfo}
        />
      )}
      {!showCreate && !currentProposal && (
        <div className={styles['detail-content']}>
          <div className={styles['content-left']}>
            <img src={daoInfo?.token?.logo || IconLogo} alt="" className={styles['logo']} />
            <p className={styles['title']}>{daoInfo?.daoName}</p>
            <p className={styles['symbol']}>{daoInfo?.token?.symbol}</p>
            <div className={styles['address']}>
              {/* <span>{detail.address.slice(0, 5) + '...' + detail.address.slice(-8)}</span> */}
              <span>{daoInfo?.token?.address && shortenAddress(daoInfo?.token?.address)}</span>
              <Copy toCopy={daoInfo?.token?.address || ''} />
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
              <Proposals
                onSelect={val => setCurrentProposal(val)}
                daoInfo={daoInfo}
                onCreate={() => setShowCreate(true)}
              />
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
