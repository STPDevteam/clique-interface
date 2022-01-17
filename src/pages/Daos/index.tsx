import './index.less'
import Search, { SearchParams } from './components/Search'
// import IconDao from '../../assets/images/token-stpt.png'
import { Avatar, Box, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useDaoAddressLists, useHomeDaoList } from 'hooks/useDaoList'
import { useHistory } from 'react-router-dom'
import { useProposalNumber } from 'hooks/useVoting'
import PublicOfferingCard from './PublicOfferingCard'
import Pagination from 'antd/lib/pagination'

enum TypeTabs {
  DAO,
  OFFERING
}

export default function Index() {
  const [currentTab, setCurrentTab] = useState<TypeTabs>(TypeTabs.DAO)
  const history = useHistory()
  const { list: daoList, page: daoListPage } = useHomeDaoList()
  const { daoAddresss: publicOfferingaddresss, page: publicOfferingPage } = useDaoAddressLists()
  // const daos = new Array(4).fill({
  //   name: 'DAO test',
  //   token: 'DTC',
  //   users: 3300,
  //   proposals: 10
  // })
  const handleSearch = (val: SearchParams) => {
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ handleSearch ~ val', val)
  }

  return (
    <div className="daos-container">
      <div className="daos-header">
        <div className="header-info">
          <p className="title">STPT DAO</p>
          <p className="text">
            Build on-chain decentralized organization and issue governance token running on Verse by using
            industry-based templates
          </p>
        </div>
        <Search placeholder="DAO Name" onSearch={handleSearch} />
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
          The funds raised will be transferred to the DAO contract, and if you withdraw the funds you need to vote to
          pass the vote before you can withdraw them. The STP protocol is open to anyone, and project configurations can
          vary widely. There are risks associated with interacting with all projects on the protocol. You should do your
          own research and understand the risks before committing your funds.
        </Typography>
      </div>
      {currentTab === TypeTabs.DAO && (
        <>
          <Grid container spacing={40}>
            {daoList.map(item => (
              <Grid key={item.daoAddress} item lg={3} md={4} sm={6} xs={12}>
                <Box
                  onClick={() => history.push('/detail/' + item.daoAddress)}
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
                    <Avatar sx={{ width: 58, height: 58 }} src={item.token?.logo}></Avatar>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'space-between'}
                      padding={'5px 0'}
                      sx={{
                        width: 'calc(100% - 74px)'
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={16}
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.daoName}
                      </Typography>
                      <Typography fontWeight={500} fontSize={14} color="#798488">
                        {item.token?.symbol}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                    <Typography fontSize={14} color={'#798488'}>
                      Holders
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      3.3k
                    </Typography>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                    <Typography fontSize={14} color={'#798488'}>
                      Proposal
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
          <Grid container spacing={12}>
            {publicOfferingaddresss.map(daoAddress => (
              <Grid key={daoAddress} item lg={4} md={6} xs={12}>
                <PublicOfferingCard daoAddress={daoAddress} />
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
  return (
    <Typography fontSize={14} fontWeight={500}>
      {proposalNumber === undefined ? '--' : proposalNumber}
    </Typography>
  )
}
