import { useEffect, useState } from 'react'
import styles from '../DaoDetail/index.module.less'
// import { Button } from 'antd'
import IconLogo from '../../assets/images/token-stpt.png'
import Proposals from './components/Proposals'
import ProposalDetail from './components/ProposalDetail'
import CreateProposal from './components/CreateProposal'
import Configuration from './components/Configuration'
import Copy from 'components/essential/Copy'
import { useExternalDaoInfoByAddress } from 'hooks/useDAOInfo'
import { useHistory, useParams } from 'react-router-dom'
import { shortenAddress } from 'utils'
import { ProposalInfoProp } from 'hooks/useVoting'
import OutlineButton from 'components/Button/OutlineButton'
import { Box } from '@mui/material'
// import ShowTokenHolders from '../Daos/ShowTokenHolders'
// import Members from 'pages/DaoDetail/components/Members'

export default function Index() {
  const links = ['Proposal', 'Configuration']
  const { address: daoAddress } = useParams<{ address: string }>()

  const [currentLink, setCurrentLink] = useState(links[0])
  const [currentProposal, setCurrentProposal] = useState<ProposalInfoProp>()
  const [showCreate, setShowCreate] = useState(false)
  const daoInfo = useExternalDaoInfoByAddress(daoAddress)
  const history = useHistory()

  useEffect(() => {
    if (daoAddress) {
      setShowCreate(false)
      setCurrentProposal(undefined)
    }
  }, [daoAddress])

  if (!daoInfo?.votingAddress) return null

  return (
    <div className={styles['dao-detail']}>
      <div className={styles['detail-header']}>
        <OutlineButton width={'120px'} onClick={() => history.push('/governance')}>
          Home
        </OutlineButton>
        <Box ml={'50px'}>
          <p className={styles['title']}>{daoInfo?.daoName || '--'}</p>
          {/* <p className={styles['text']}>
          {' '}
          <ShowTokenHolders address={daoInfo?.token?.address} /> Holders
        </p> */}
          <p>{daoInfo?.daoDesc}</p>
          {/* <Button className={'btn-common btn-01'}>Join</Button> */}
        </Box>
      </div>
      {currentProposal && daoInfo && (
        <ProposalDetail
          detail={currentProposal}
          daoInfo={daoInfo}
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
            <img src={daoInfo?.logo || IconLogo} alt="" className={styles['logo']} />
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
            {/* {currentLink === 'Members' && daoInfo && <Members daoInfo={daoInfo} />} */}
            {currentLink === 'Configuration' && daoInfo && daoInfo.rule && daoInfo.totalSupply && (
              <Configuration
                totalSupply={daoInfo.totalSupply}
                votingAddress={daoInfo.votingAddress}
                rule={daoInfo.rule}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
