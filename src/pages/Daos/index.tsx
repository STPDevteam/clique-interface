import './index.less'
// import { Search, SearchParams } from './components/Search'
// import IconDao from '../../assets/images/token-stpt.png'
import { Avatar, Box, Grid, Typography } from '@mui/material'
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
import { ReactComponent as CloseSvg } from 'assets/svg/close.svg'

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
  const [closeMsg, setCloseMsg] = useState(false)

  const {
    daoAddresss: publicOfferingAddresss,
    page: publicOfferingPage,
    loading: publicOfferingLoading
  } = useDaoAddressLists()
  const publicOfferingDaoListAddresss = useMemo(() => publicOfferingAddresss.filter(i => i), [publicOfferingAddresss])
  const publicOfferingDaoTypes = useGetDaoTypes(publicOfferingDaoListAddresss as string[])

  return (
    <div className="daos-container">
      {!closeMsg && (
        <div className="daos-header">
          <CloseSvg className="close" onClick={() => setCloseMsg(true)}></CloseSvg>
          <div className="header-info">
            <p className="title">Clique</p>
            <p className="text">
              Discover DAOs and participate in governance activities through proposal voting, crowdfunding and more to
              come!
            </p>
            <ExternalLink href="https://stp-dao.gitbook.io/verse-network/dapps/clique">how it works</ExternalLink>
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
          <Grid container spacing={40}>
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
                    padding={'25px 16px'}
                    height={186}
                    sx={{
                      background: '#FFFFFF',
                      border: '0.5px solid #D8D8D8',
                      boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.6)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  >
                    <Box display={'flex'} gap={16} mb={15}>
                      <Avatar sx={{ width: 58, height: 58 }} src={item.logo}>
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
                          <Typography variant="h6" noWrap>
                            {item.daoName}
                          </Typography>
                          <VerifiedTag address={item.daoAddress} />
                        </Box>

                        <Typography fontWeight={500} fontSize={14} color="#798488">
                          {item.token?.symbol}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                      <Typography variant="body1">Members</Typography>
                      <Typography fontSize={14} variant="h6">
                        <ShowTokenHolders address={item.token?.address} />
                      </Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                      <Typography variant="body1">Proposals</Typography>
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.90445 15.64H8.15008L6.3757 13.8125H3.75133L3.1882 13.2812V10.71L1.39258 8.88248V8.12811L3.1882 6.30061V3.71873L3.75133 3.18748H6.3757L8.15008 1.37061H8.90445L10.732 3.18748H13.3138L13.8451 3.70811V6.30061L15.662 8.12811V8.88248L13.8132 10.71V13.2812L13.282 13.8125H10.732L8.90445 15.64V15.64ZM7.15133 11.135H7.9057L11.9113 7.12936L11.157 6.37498L7.53383 10.0087L6.06758 8.54248L5.3132 9.29686L7.15133 11.135Z"
        fill="#3898FC"
      />
    </svg>
  )
}
