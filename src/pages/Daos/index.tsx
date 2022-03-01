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
import { useIsExternalDaos } from 'hooks/useDAOInfo'
import { ReactComponent as IconDao } from 'assets/svg/icon-dao.svg'

enum TypeTabs {
  DAO,
  OFFERING
}

export default function Index() {
  const [currentTab, setCurrentTab] = useState<TypeTabs>(TypeTabs.DAO)
  const history = useHistory()
  const { list: daoList, page: daoListPage, loading: daoListLoading } = useHomeDaoList()
  const daoListAddresss = useMemo(() => daoList.map(item => item.daoAddress).filter(i => i), [daoList])
  const isExternalDaos = useIsExternalDaos(daoListAddresss as string[])

  const {
    daoAddresss: publicOfferingAddresss,
    page: publicOfferingPage,
    loading: publicOfferingLoading
  } = useDaoAddressLists()
  const publicOfferingDaoListAddresss = useMemo(() => publicOfferingAddresss.filter(i => i), [publicOfferingAddresss])
  const publicOfferingIsExternalDaos = useIsExternalDaos(publicOfferingDaoListAddresss as string[])

  return (
    <div className="daos-container">
      <div className="daos-header">
        <div className="header-info">
          <p className="title">Clique</p>
          <p className="text">
            Build decentralized automated organization and issue governance token running on Verse and Ethereum
            blockchain within a few clicks.
          </p>
          <ExternalLink href="https://stp-dao.gitbook.io/verse-network/">how it works</ExternalLink>
        </div>
        {/* <Search placeholder="DAO Name" onSearch={handleSearch} /> */}
      </div>
      <div>
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
        <Typography fontSize={12} padding={'20px 10px'}>
          The funds raised will be locked in the corresponding DAO contract. Community votes will be needed to withdraw
          the funds from the DAO contracts. Clique is open to anyone and there is risk interacting with the projects on
          the Clique. You should do your own research and understand the risks before committing your funds.
        </Typography>
      </div>
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
                      if (isExternalDaos.loading) return
                      if (isExternalDaos.data[index]) {
                        history.push('/external_detail/' + item.daoAddress)
                      } else {
                        history.push('/detail/' + item.daoAddress)
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
                        <Typography variant="h6" noWrap>
                          {item.daoName}
                        </Typography>
                        <Typography fontWeight={500} fontSize={14} color="#798488">
                          {item.token?.symbol}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                      <Typography variant="body1">Holders</Typography>
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
              !publicOfferingIsExternalDaos.loading &&
              publicOfferingAddresss.map((daoAddress, index) => (
                <Grid key={daoAddress} item lg={4} md={6} xs={12}>
                  {publicOfferingIsExternalDaos.data[index] ? (
                    <NonePublicOfferingCard daoAddress={daoAddress} />
                  ) : (
                    <PublicOfferingCard daoAddress={daoAddress} />
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
