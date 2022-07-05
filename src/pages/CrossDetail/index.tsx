import { useEffect, useState } from 'react'
import styles from '../DaoDetail/index.module.less'
// import { Button } from 'antd'
import IconLogo from '../../assets/images/token-stpt.png'
import Proposals from './components/Proposals'
import ProposalDetail from './components/ProposalDetail'
import CreateProposal from './components/CreateProposal'
import Configuration from './components/Configuration'
// import Copy from 'components/essential/Copy'
import { useCrossDaoInfoByAddress } from 'hooks/useDAOInfo'
import { useParams } from 'react-router-dom'
// import { shortenAddress } from 'utils'
import { ProposalInfoProp } from 'hooks/useVoting'
import { Spin } from 'antd'
import { useActiveWeb3React } from 'hooks'
import { Avatar, Box, Link, Typography, useTheme } from '@mui/material'
import { CROSS_SUPPORT_CREATE_NETWORK } from '../../constants'
import { VerifiedTag } from 'pages/Daos'
import { getEtherscanLink } from 'utils'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'

export default function Index() {
  const links = ['Proposal', 'Configuration']
  const { chainId } = useActiveWeb3React()
  const { address: daoAddress } = useParams<{ address: string }>()
  const theme = useTheme()

  const [currentLink, setCurrentLink] = useState(links[0])
  const [currentProposal, setCurrentProposal] = useState<ProposalInfoProp>()
  const [showCreate, setShowCreate] = useState(false)
  const daoInfo = useCrossDaoInfoByAddress(daoAddress)

  useEffect(() => {
    if (daoAddress) {
      setShowCreate(false)
      setCurrentProposal(undefined)
    }
  }, [daoAddress])

  if (!daoInfo?.votingAddress) return null
  if (!chainId || !CROSS_SUPPORT_CREATE_NETWORK.includes(chainId))
    return <Box padding="20px">Cross-chain Governance unavailable on current chain</Box>

  return (
    <Spin spinning={!daoInfo?.token} tip="Loading..." delay={2000} size="large">
      <div className={styles['dao-detail']}>
        <div className={styles['detail-header']}>
          <div className={styles['top1']}>
            <Avatar sx={{ width: 100, height: 100 }} src={daoInfo?.logo || IconLogo}></Avatar>
            <Box ml={'24px'}>
              <Box className={styles['title']} display="flex" alignItems={'center'} gap="5px">
                {daoInfo?.daoName || '--'}
                <VerifiedTag address={daoInfo?.daoAddress} />
              </Box>
              <Box display={'flex'} justifyContent="space-between" mb={6}>
                <Link
                  target={'_blank'}
                  underline="none"
                  href={getEtherscanLink(daoInfo.token?.chainId || 1, daoInfo.token?.address || '', 'address')}
                >
                  {daoInfo?.token?.symbol}
                </Link>
                <Box display={'flex'} alignItems="center">
                  {daoInfo.link.twitter && (
                    <Link target={'_blank'} href={daoInfo.link.twitter} underline="none" ml={10}>
                      <Twitter />
                    </Link>
                  )}
                  {daoInfo.link.discord && (
                    <Link target={'_blank'} href={daoInfo.link.discord} underline="none" ml={10}>
                      <Discord />
                    </Link>
                  )}
                  {daoInfo.link.website && (
                    <Link fontSize={12} target={'_blank'} href={daoInfo.link.website} underline="none" ml={10}>
                      {daoInfo.link.website}
                    </Link>
                  )}
                </Box>
              </Box>
              <Typography color={theme.palette.text.secondary}>{daoInfo?.daoDesc}</Typography>
              {/* <Button className={'btn-common btn-01'}>Join</Button> */}
            </Box>
          </div>

          <ul className={styles['tabs']}>
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
        {currentLink === 'Proposal' && (
          <>
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
          </>
        )}
        {!showCreate && !currentProposal && currentLink === 'Proposal' && (
          <div className={styles['detail-content']}>
            <div className={styles['content-right']}>
              <Proposals
                onSelect={val => setCurrentProposal(val)}
                daoInfo={daoInfo}
                onCreate={() => setShowCreate(true)}
              />
            </div>
          </div>
        )}
        {currentLink === 'Configuration' && daoInfo && daoInfo.rule && daoInfo.totalSupply && (
          <div className={styles['detail-content']}>
            <div className={styles['content-right']}>
              <Configuration
                totalSupply={daoInfo.totalSupply}
                votingAddress={daoInfo.votingAddress}
                rule={daoInfo.rule}
                daoAddress={daoInfo.daoAddress}
              />
            </div>
          </div>
        )}
      </div>
    </Spin>
  )
}
