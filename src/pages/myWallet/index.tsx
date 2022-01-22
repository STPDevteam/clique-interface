import { Box, styled, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { ReactComponent as MyWalletIcon } from 'assets/svg/my_wallet.svg'
import { Empty, Pagination, Spin, Table, Tabs } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useAccountERC20Tokens } from 'hooks/useStpExplorerData'
import { useHistory } from 'react-router-dom'
import { MyWalletHistoryProp, useMyWalletHistory, useQueryDaoByTokenAddress } from 'hooks/useBackedServer'
import { ExternalLink } from 'theme/components'
import { shortenHashAddress, timeStampToFormat } from 'utils/dao'
import { getEtherscanLink, shortenAddress } from 'utils'
import { DefaultChainId } from '../../constants'
import { useToken } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 138,
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  padding: '0 43px'
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

function GoDaoLink({ address }: { address: string }) {
  const ret = useQueryDaoByTokenAddress(address)
  return ret ? <ExternalLink href={'/detail/' + ret}>DAO</ExternalLink> : <>-</>
}

export default function Index() {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  useEffect(() => {
    if (!account) history.replace('/')
  }, [account, history])
  const TABS = ['Wallet', 'History']
  const [currentTab, setCurrentTab] = useState(TABS[0])
  const { data: myTokens, loading: myTokensLoading } = useAccountERC20Tokens()
  const myTokenData = useMemo(
    () =>
      myTokens.map(item => ({
        asset: item.token.symbol,
        price: '-',
        balance: item.toSignificant(6, { groupSeparator: ',' }),
        daoName: <GoDaoLink address={item.token.address} />,
        value: '-'
      })),
    [myTokens]
  )
  const { result: myWalletHistory, page, loading } = useMyWalletHistory()

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

            {currentTab === 'Wallet' && (
              <Table
                className="stp-table"
                loading={myTokensLoading}
                dataSource={myTokenData}
                rowKey={'id'}
                pagination={false}
              >
                <Column title="Asset" dataIndex="asset" key="id" align="center" />
                <Column title="Price" dataIndex="price" key="id" align="center" />
                <Column align="center" title="Balance" dataIndex="balance" key="quantity" />
                <Column title="Value" dataIndex="value" key="id" align="center" />
                <Column title="DAO Name" dataIndex="daoName" key="proposals" align="center" />
              </Table>
            )}
            {currentTab === 'History' && (
              <>
                {loading && (
                  <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50}>
                    <Spin size="large" tip="Loading..." />
                  </Box>
                )}
                {!loading && myWalletHistory.length === 0 && (
                  <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50}>
                    <Empty description="No records currently" />
                  </Box>
                )}
                {!loading && myWalletHistory.map((item, index) => <HistoryItem key={index} item={item} />)}
                <Box display={'flex'} justifyContent={'center'} mb={10}>
                  <Pagination
                    simple
                    size="default"
                    hideOnSinglePage
                    pageSize={page.pageSize}
                    style={{ marginTop: 20 }}
                    current={page.currentPage}
                    total={page.total}
                    onChange={e => page.setCurrentPage(e)}
                  />
                </Box>
              </>
            )}
          </Container>
        </StyledBox>
      )}
    </>
  )
}

function HistoryItem({ item }: { item: MyWalletHistoryProp }) {
  const { chainId } = useActiveWeb3React()
  return (
    <Box
      sx={{
        border: '0.5px solid #D8D8D8',
        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        marginBottom: 16,
        marginRight: 5,
        padding: '26px 52px'
      }}
      display={'grid'}
      gridTemplateColumns={'1fr 1fr 1fr 1fr'}
      gap={'10px'}
      alignItems={'center'}
    >
      <Box>
        <Typography variant="h6">{item.type}</Typography>
        <Typography>{timeStampToFormat(item.timeStamp)}</Typography>
      </Box>
      <Box>
        {item.tokenArray.map((item, index) => (
          <ShowTokenAmtInfo key={index} data={item} />
        ))}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={400}>
          From: {shortenAddress(item.from)}
        </Typography>
        <Typography variant="h6" fontWeight={400}>
          To: {shortenAddress(item.to)}
        </Typography>
      </Box>
      <ExternalLink href={getEtherscanLink(chainId || DefaultChainId, item.hash, 'transaction')}>
        <Typography textAlign={'right'} variant="h6">
          {shortenHashAddress(item.hash)}
        </Typography>
      </ExternalLink>
    </Box>
  )
}

function ShowTokenAmtInfo({
  data
}: {
  data: {
    address: string
    value: string
    mark: string
  }
}) {
  const token = useToken(data.address)
  const bal = useMemo(() => {
    if (!token) return undefined
    return new TokenAmount(token, data.value)
  }, [data.value, token])
  return (
    <Typography variant="h6">
      {data.mark}
      {bal?.toSignificant(6, { groupSeparator: ',' })} {token?.symbol}
    </Typography>
  )
}
