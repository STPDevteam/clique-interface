import './index.less'
import Search, { SearchParams } from './components/Search'
// import IconDao from '../../assets/images/token-stpt.png'
import { Progress } from 'antd'
import { Avatar, Box, Grid, styled, Typography } from '@mui/material'
import { useState } from 'react'
import { useDaoContractAddressById } from 'hooks/useDAOFactoryInfo'

const StyledText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  height: 52,
  lineHeight: '16px'
})

enum TypeTabs {
  DAO,
  OFFERING
}

export default function Index() {
  const [currentTab, setCurrentTab] = useState<TypeTabs>(TypeTabs.DAO)

  const id = useDaoContractAddressById(1)
  console.log('🚀 ~ file: index.tsx ~ line 28 ~ Index ~ id', id)
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
            <Typography fontSize={16} fontWeight={600}>
              DAO
            </Typography>
          </div>
          <div
            className={`two ${TypeTabs.OFFERING === currentTab ? 'active' : ''}`}
            onClick={() => setCurrentTab(TypeTabs.OFFERING)}
          >
            <Typography fontSize={16} fontWeight={600}>
              Public Offering
            </Typography>
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
        <Grid container spacing={40}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <Grid key={item} item lg={3} md={4} sm={6} xs={12}>
              <Box
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
                  <Avatar sx={{ width: 58, height: 58 }}></Avatar>
                  <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} padding={'5px 0'}>
                    <Typography
                      fontWeight={600}
                      fontSize={16}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      DAO Test
                    </Typography>
                    <Typography fontWeight={500} fontSize={14} color="#798488">
                      DTC
                    </Typography>
                  </Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                  <Typography fontSize={14} color={'#798488'}>
                    User
                  </Typography>
                  <Typography fontSize={14} fontWeight={500}>
                    3.3k
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                  <Typography fontSize={14} color={'#798488'}>
                    Proposal
                  </Typography>
                  <Typography fontSize={14} fontWeight={500}>
                    10
                  </Typography>
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
      )}
      {currentTab === TypeTabs.OFFERING && (
        <Grid container spacing={12}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <Grid key={item} item lg={4} md={6} xs={12}>
              <Box
                padding={'29px 17px'}
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
                <Box display={'grid'} gap={14} gridTemplateColumns={'58px 80px 1fr'} mb={22}>
                  <Avatar sx={{ width: 58, height: 58 }}></Avatar>
                  <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} pt={5} height={52}>
                    <Typography
                      fontWeight={600}
                      fontSize={16}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      DAO Test
                    </Typography>
                    <Typography fontWeight={500} fontSize={14} color="#798488">
                      DTC
                    </Typography>
                  </Box>
                  <StyledText fontSize={10} pt={5}>
                    The STP protocol is open to anyone, and project configurations can vary widely. There are risks
                    oject configurations can vary widely. There are risks oject configurations can vary widely. There
                    are risks
                  </StyledText>
                </Box>
                <Progress percent={50} showInfo={false} />
                <Box display={'flex'} justifyContent={'space-between'} mt={10}>
                  <Typography variant="body2">3,000 STPT pledged</Typography>
                  <Typography variant="body2" color={'#798488'}>
                    8% funded
                  </Typography>
                  <Typography variant="body2" color={'#798488'}>
                    Start at 2021-12-16
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}
