import { Box, styled, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { ReactComponent as MyWalletIcon } from 'assets/svg/my_wallet.svg'
import { Table, Tabs } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useAccountERC20Tokens } from 'hooks/useStpExplorerData'
import { useHistory } from 'react-router-dom'

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 138,
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  padding: '23px 43px'
})
const Container = styled(Box)({
  maxWidth: 852,
  width: '100%',
  margin: '0 auto'
})
const StyledBox = styled(Box)({
  '.my-tabs': {
    '.ant-tabs-tab-active': {
      color: '#22304A'
    },
    '.ant-tabs-tab': {
      marginRight: 120
    }
  }
})
const { TabPane } = Tabs
const { Column } = Table
export default function Index() {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  useEffect(() => {
    if (!account) history.replace('/')
  }, [account, history])
  const TABS = ['Wallet']
  const [currentTab, setCurrentTab] = useState(TABS[0])
  const { data: myTokens, loading: myTokensLoading } = useAccountERC20Tokens()
  const myTokenData = useMemo(
    () =>
      myTokens.map(item => ({
        asset: item.token.symbol,
        balance: item.toSignificant(6, { groupSeparator: ',' }),
        daoName: '-'
      })),
    [myTokens]
  )

  return (
    <>
      <StyledHeader>
        <Container display={'flex'} justifyContent={'space-between'} alignItems={'center'} minHeight={138}>
          <Box display={'flex'} gap={10}>
            <MyWalletIcon />
            <Typography variant="h5">{account}</Typography>
          </Box>
        </Container>
      </StyledHeader>
      {account && (
        <StyledBox padding={'20px'}>
          <Container>
            <Tabs
              defaultActiveKey={currentTab}
              onChange={key => {
                setCurrentTab(key)
              }}
              className="my-tabs"
            >
              {TABS.map(tab => (
                <TabPane tab={tab} key={tab}></TabPane>
              ))}
            </Tabs>

            <Table
              className="stp-table"
              loading={myTokensLoading}
              dataSource={myTokenData}
              rowKey={'id'}
              pagination={false}
            >
              <Column title="Asset" dataIndex="asset" key="id" align="center" />
              <Column align="center" title="Balance" dataIndex="balance" key="quantity" />
              <Column title="DAO Name" dataIndex="daoName" key="proposals" align="center" />
            </Table>
          </Container>
        </StyledBox>
      )}
    </>
  )
}
