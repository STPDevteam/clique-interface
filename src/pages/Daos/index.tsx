import './index.less'
import Search, { SearchParams } from './components/Search'
import IconDao from '../../assets/images/token-stpt.png'
import { Button } from 'antd'
import { Box, Typography } from '@mui/material'

export default () => {
  const daos = new Array(4).fill({
    name: 'DAO test',
    token: 'DTC',
    users: 3300,
    proposals: 10
  })
  const handleSearch = (val: SearchParams) => {
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ handleSearch ~ val', val)
  }
  const handleJoin = (item: any) => {
    console.log('🚀 ~ file: index.tsx ~ line 18 ~ item', item)
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
          <div className="one">
            <Typography className="one" fontSize={16} fontWeight={600} color={'#22304A'}>
              DAO
            </Typography>
          </div>
          <div className="two">
            <Typography className="two" fontSize={16} fontWeight={600} color={'#fff'}>
              Public Offering
            </Typography>
          </div>
        </Box>
        <Typography fontSize={12} padding={'20px 40px'}>
          The funds raised will be transferred to the DAO contract, and if you withdraw the funds you need to vote to
          pass the vote before you can withdraw them. The STP protocol is open to anyone, and project configurations can
          vary widely. There are risks associated with interacting with all projects on the protocol. You should do your
          own research and understand the risks before committing your funds.
        </Typography>
      </div>
      <Box display="flex" gap="40px" className="daos-list">
        {daos.map(item => (
          <div key={item.token} className="dao-item">
            <div className="dao-header">
              <img src={IconDao} alt="" />
              <div className="header-info">
                <p className="title">{item.name}</p>
                <p className="token">{item.token}</p>
              </div>
            </div>
            <div className="dao-data">
              <div className="dao-data-item">
                <span className="label">User</span>
                <span className="value">{item.users / 1000}k</span>
              </div>
              <div className="dao-data-item">
                <span className="label">Proposals</span>
                <span className="value">{item.proposals}</span>
              </div>
            </div>
            <Button
              className="btn-common btn-01 btn-join"
              onClick={() => {
                handleJoin(item)
              }}
            >
              Join
            </Button>
          </div>
        ))}
      </Box>
    </div>
  )
}
