import './index.less'
// import { Search, SearchParams } from './components/Search'
// import IconDao from '../../assets/images/token-stpt.png'
import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useDaoAddressLists, useHomeDaoList } from 'hooks/useDaoList'
import { useHistory } from 'react-router-dom'
import { useProposalNumber } from 'hooks/useVoting'
import PublicOfferingCard, { NonePublicOfferingCard } from './PublicOfferingCard'
import Pagination from 'antd/lib/pagination'
import ShowTokenHolders from './ShowTokenHolders'
import { Empty, Spin } from 'antd'
import { ExternalLink } from 'theme/components'
import { DaoTypeProp, useGetDaoTypes, useIsVerifiedDao } from 'hooks/useDAOInfo'
import { ReactComponent as IconDao } from 'assets/svg/icon-dao.svg'
// import { ReactComponent as CloseSvg } from 'assets/svg/close.svg'
import CheckSwitchChainMask from 'components/Modal/CheckSwitchChainMask'

enum TypeTabs {
  DAO,
  OFFERING
}

export default function Index() {
  const [currentTab, setCurrentTab] = useState<TypeTabs>(TypeTabs.DAO)
  const history = useHistory()
  const { list: daoList, page: daoListPage, loading: daoListLoading } = useHomeDaoList()
  const daoListAddresss = useMemo(() => daoList.map(item => item.daoAddress).filter(i => i), [daoList])
  const daoTypes = useGetDaoTypes(daoListAddresss as string[])
  // const [closeMsg, setCloseMsg] = useState(Boolean(sessionStorage.getItem('stp_home_alert')) || false)
  const [closeMsg] = useState(false)
  const theme = useTheme()

  const {
    daoAddresss: publicOfferingAddresss,
    page: publicOfferingPage,
    loading: publicOfferingLoading
  } = useDaoAddressLists()
  const publicOfferingDaoListAddresss = useMemo(() => publicOfferingAddresss.filter(i => i), [publicOfferingAddresss])
  const publicOfferingDaoTypes = useGetDaoTypes(publicOfferingDaoListAddresss as string[])

  return (
    <div className="daos-container">
      <CheckSwitchChainMask />
      {!closeMsg && (
        <div className="daos-header">
          {/* <CloseSvg
            className="close"
            onClick={() => {
              sessionStorage.setItem('stp_home_alert', 'true')
              setCloseMsg(true)
            }}
          ></CloseSvg> */}
          <div className="header-info">
            <p className="title">Main Dashboard</p>
            <p className="text">
              Discover DAOs and participate in governance activities through proposal voting, crowdfunding and more to
              come!
              <ExternalLink
                style={{ fontSize: 14, fontWeight: 600, color: 'inherit' }}
                href="https://stp-dao.gitbook.io/verse-network/clique/overview-of-clique"
              >
                {` How it works >`}
              </ExternalLink>
            </p>
          </div>
          {/* <Search placeholder="DAO Name" onSearch={handleSearch} /> */}
        </div>
      )}
      <Box mb={30} className={'hide'}>
        <Box className="dao-group-btn" display={'grid'} gridTemplateColumns={'100px 2fr'} mt={10}>
          <div
            className={`one ${TypeTabs.DAO === currentTab ? 'active' : ''}`}
            onClick={() => setCurrentTab(TypeTabs.DAO)}
          >
            DAO
          </div>
          <div
            className={`two ${TypeTabs.OFFERING === currentTab ? 'active' : ''}`}
            onClick={() => setCurrentTab(TypeTabs.OFFERING)}
          >
            Public Offering
          </div>
        </Box>
        {/* <Typography fontSize={12} padding={'20px 10px'}>
          The funds raised will be locked in the corresponding DAO contract. Community votes will be needed to withdraw
          the funds from the DAO contracts. Clique is open to anyone and there is risk interacting with the projects on
          the Clique. You should do your own research and understand the risks before committing your funds.
        </Typography> */}
      </Box>
      {currentTab === TypeTabs.DAO && (
        <>
          {daoListLoading && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Spin size="large" tip="Loading..." />
            </Box>
          )}
          {!daoListLoading && daoList.length === 0 && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Empty description="No daos currently" />
            </Box>
          )}
          <Grid container spacing={18}>
            {!daoListLoading &&
              daoList.map((item, index) => (
                <Grid key={item.daoAddress} item lg={3} md={4} sm={6} xs={12}>
                  <Box
                    onClick={() => {
                      if (daoTypes.loading) return
                      if (daoTypes.data[index] === DaoTypeProp.ExternalDao) {
                        history.push('/external_detail/' + item.daoAddress)
                      } else if (daoTypes.data[index] === DaoTypeProp.RawDao) {
                        history.push('/detail/' + item.daoAddress)
                      } else {
                        history.push(`/cross_detail/${item.daoAddress}`)
                      }
                    }}
                    height={205}
                    sx={{
                      // background: '#FFFFFF',
                      padding: '23px',
                      border: `1px solid ${theme.bgColor.bg2}`,
                      borderRadius: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.5s',
                      '&:hover': {
                        border: '2px solid #0049C6',
                        padding: '22px',
                        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  >
                    <Box display={'flex'} gap={16} mb={15}>
                      <Avatar sx={{ width: 58, height: 58, border: `1px solid ${theme.bgColor.bg2}` }} src={item.logo}>
                        <IconDao />
                      </Avatar>
                      <Box
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'space-between'}
                        padding={'5px 0'}
                        sx={{
                          width: 'calc(100% - 74px)'
                        }}
                      >
                        <Box display={'flex'} alignItems="center" gap="5px">
                          <Typography variant="h6" noWrap maxWidth="80%">
                            {item.daoName}
                          </Typography>
                          <VerifiedTag address={item.daoAddress} />
                        </Box>

                        <Typography fontWeight={500} fontSize={14} color="#808191">
                          {item.token?.symbol}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography className="two-nowrap" color={theme.palette.text.secondary} height={50}>
                      {item.daoDesc}
                    </Typography>
                    {item.token?.address && (
                      <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography variant="body1" color="#B2B3BD" fontWeight={600}>
                          Members
                        </Typography>
                        <Typography fontSize={14} variant="h6">
                          <ShowTokenHolders address={item.token?.address} />
                        </Typography>
                      </Box>
                    )}
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography variant="body1" color="#B2B3BD" fontWeight={600}>
                        Proposals
                      </Typography>
                      <ShowProposalNumber votingAddress={item.votingAddress} daoAddress={item.daoAddress} />
                    </Box>

                    {/* <Button
                  className="btn-common btn-01 btn-join"
                  onClick={() => {
                    handleJoin(item)
                  }}
                >
                  Join
                </Button> */}
                  </Box>
                </Grid>
              ))}
          </Grid>
          <Pagination
            simple
            size="default"
            hideOnSinglePage
            pageSize={daoListPage.pageSize}
            style={{ marginTop: 20 }}
            current={daoListPage.currentPage}
            total={daoListPage.total}
            onChange={e => daoListPage.setCurrentPage(e)}
          />
        </>
      )}
      {currentTab === TypeTabs.OFFERING && (
        <>
          {publicOfferingLoading && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Spin size="large" tip="Loading..." />
            </Box>
          )}
          {!publicOfferingLoading && daoList.length === 0 && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Empty description="No public offerings currently" />
            </Box>
          )}
          <Grid container spacing={12}>
            {!publicOfferingLoading &&
              !publicOfferingDaoTypes.loading &&
              publicOfferingAddresss.map((daoAddress, index) => (
                <Grid key={daoAddress} item lg={4} md={6} xs={12}>
                  {publicOfferingDaoTypes.data[index] === DaoTypeProp.RawDao ? (
                    <PublicOfferingCard daoAddress={daoAddress} />
                  ) : (
                    <NonePublicOfferingCard
                      daoAddress={daoAddress}
                      typeName={
                        publicOfferingDaoTypes.data[index] === DaoTypeProp.CrossGovDao ? 'Cross gov' : undefined
                      }
                    />
                  )}
                </Grid>
              ))}
          </Grid>
          <Pagination
            simple
            hideOnSinglePage
            pageSize={publicOfferingPage.pageSize}
            style={{ marginTop: 20 }}
            current={publicOfferingPage.currentPage}
            total={publicOfferingPage.total}
            onChange={e => publicOfferingPage.setCurrentPage(e)}
          />
        </>
      )}
    </div>
  )
}

function ShowProposalNumber({
  votingAddress,
  daoAddress
}: {
  votingAddress: string | undefined
  daoAddress: string | undefined
}) {
  const proposalNumber = useProposalNumber(votingAddress, daoAddress)
  return <Typography variant="h6">{proposalNumber === undefined ? '--' : proposalNumber}</Typography>
}

export function VerifiedTag({ address }: { address?: string }) {
  const isVerified = useIsVerifiedDao(address)
  if (!isVerified) return null
  return (
    <svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20.5C12.6522 20.5 15.1957 19.4464 17.0711 17.5711C18.9464 15.6957 20 13.1522 20 10.5C20 7.84784 18.9464 5.3043 17.0711 3.42893C15.1957 1.55357 12.6522 0.5 10 0.5C7.34784 0.5 4.8043 1.55357 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 13.1522 1.05357 15.6957 2.92893 17.5711C4.8043 19.4464 7.34784 20.5 10 20.5ZM10.315 4.335C10.2441 4.29079 10.1647 4.26195 10.082 4.25033C9.99922 4.23871 9.91495 4.24457 9.83461 4.26754C9.75428 4.29051 9.67965 4.33008 9.61555 4.38368C9.55146 4.43729 9.49932 4.50374 9.4625 4.57875L7.9625 7.61875L4.6075 8.10625C4.49688 8.12195 4.39289 8.16836 4.30731 8.24019C4.22174 8.31202 4.15803 8.40641 4.1234 8.51264C4.08877 8.61886 4.08462 8.73267 4.11142 8.84113C4.13822 8.9496 4.19489 9.04837 4.275 9.12625L6.705 11.4913L6.13 14.8337C6.11105 14.9437 6.12327 15.0568 6.16529 15.1602C6.2073 15.2636 6.27743 15.3531 6.36772 15.4187C6.45801 15.4843 6.56486 15.5232 6.67617 15.5312C6.78748 15.5392 6.89879 15.5158 6.9975 15.4637L10 13.8862L13 15.4625C13.0987 15.5145 13.21 15.5379 13.3213 15.5299C13.4326 15.522 13.5395 15.483 13.6298 15.4174C13.7201 15.3519 13.7902 15.2623 13.8322 15.1589C13.8742 15.0555 13.8865 14.9425 13.8675 14.8325L13.295 11.4913L15.7225 9.125C15.8018 9.04696 15.8577 8.94838 15.8841 8.84033C15.9104 8.73227 15.9062 8.619 15.8718 8.51323C15.8374 8.40745 15.7742 8.31334 15.6894 8.24146C15.6045 8.16958 15.5012 8.12276 15.3912 8.10625L12.035 7.61875L10.535 4.57875C10.4859 4.47855 10.4097 4.39411 10.315 4.335Z"
        fill="#0049C6"
      />
    </svg>
  )
}
