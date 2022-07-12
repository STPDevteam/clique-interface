import { Box, Link, styled, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { ReactComponent as MyWalletIcon } from 'assets/svg/my_wallet.svg'
import { Empty, Pagination, Spin, Table, Tabs } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useAccountERC20Tokens } from 'hooks/useStpExplorerData'
import { useHistory } from 'react-router-dom'
import { MyWalletHistoryProp, useAccountDaoAssets, useMyWalletHistory } from 'hooks/useBackedServer'
import { Dots, ExternalLink } from 'theme/components'
import { shortenHashAddress, timeStampToFormat } from 'utils/dao'
import { getEtherscanLink, shortenAddress } from 'utils'
import {
  CROSS_SUPPORT_CREATE_NETWORK,
  DefaultChainId,
  SUPPORT_CREATE_TOKEN_NETWORK,
  ZERO_ADDRESS
} from '../../constants'
import { useCreateTokenLogo, useCurrencyBalance, useSTPToken, useToken, useTokenBalance } from 'state/wallet/hooks'
import { Currency, CurrencyAmount, ETHER, TokenAmount } from 'constants/token'
import Image from 'components/Image'
import { Alert } from 'antd'
import { useCreateTokenList, useCreateTokenReserved } from 'hooks/useCreateTokenInfo'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { useCreateERC20ClaimCallback } from 'hooks/useCreateERC20ClaimCallback'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import Button from 'components/Button/Button'
import Copy from 'components/essential/Copy'
import { ShowTokenBalance } from 'pages/DaoDetail/components/Assets'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StyledHeader = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 80px)',
  margin: '30px auto 0',
  minHeight: 138,
  borderRadius: '24px',
  backgroundColor: theme.palette.common.white,
  padding: '0 43px'
}))
const Container = styled(Box)({
  maxWidth: 852,
  width: '100%',
  margin: '0 auto'
})
const StyledBox = styled(Box)(({ theme }) => ({
  '.my-tabs': {
    '.ant-tabs-tab-active': {
      color: theme.palette.text.primary
    },
    '.ant-tabs-tab': {
      marginRight: 120,
      fontWeight: 600,
      '&:hover': {
        color: theme.palette.text.primary
      }
    }
  },
  '.ant-tabs-ink-bar': {
    backgroundColor: theme.palette.text.primary,
    height: 3
  }
}))
const { TabPane } = Tabs
const { Column } = Table

function GoDaoLink({ address }: { address: string }) {
  return address ? (
    <ExternalLink target="self" href={'/#/detail/' + address}>
      DAO
    </ExternalLink>
  ) : (
    <>-</>
  )
}

function ShowToken({ address }: { address: string }) {
  const token = useSTPToken(address)
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
      <Image src={token?.logo || ''} width={20} height={20} style={{ borderRadius: '50%' }}></Image>
      <Typography>{token?.symbol || '-'}</Typography>
    </Box>
  )
}

function ShowCreateToken({ address }: { address: string }) {
  const token = useToken(address)
  const logoUrl = useCreateTokenLogo(address)
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
      <Image src={logoUrl || ''} width={20} height={20} style={{ borderRadius: '50%' }}></Image>
      <Typography>{token?.symbol || '-'}</Typography>
    </Box>
  )
}

function ShowTokenBal({ address }: { address: string }) {
  const token = useToken(address)
  const { account } = useActiveWeb3React()
  const bal = useTokenBalance(account || undefined, token)
  return <Typography>{bal?.toSignificant(6, { groupSeparator: ',' }) || '-'}</Typography>
}

export default function Index() {
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  useEffect(() => {
    if (!account) history.replace('/')
  }, [account, history])
  const TABS =
    chainId && SUPPORT_CREATE_TOKEN_NETWORK.includes(chainId)
      ? ['Wallet', 'History', 'My Created Token']
      : ['Wallet', 'History']
  const [currentTab, setCurrentTab] = useState(TABS[0])

  const currentEthToken = useMemo(() => {
    if (!chainId) return undefined
    return Currency.get_ETH_TOKEN(chainId)
  }, [chainId])
  const currentEthTokenBalance = useCurrencyBalance(account || undefined, ETHER)

  // const { data: myTokens, loading: myTokensLoading } = useAccountERC20Tokens()
  const { loading: myTokensLoading, list: myTokens, page: walletPage } = useAccountDaoAssets()
  const myTokenData = useMemo(() => {
    const ret = myTokens.map(item => ({
      asset: item.daoAddress ? (
        <ShowToken address={item.tokenAddress} />
      ) : (
        <ShowCreateToken address={item.tokenAddress} />
      ),
      price: '-',
      // balance: item.toSignificant(6, { groupSeparator: ',' }),
      balance: <ShowTokenBal address={item.tokenAddress} />,
      daoName: <GoDaoLink address={item.daoAddress} />,
      value: '-'
    }))
    if (walletPage.currentPage === 1) {
      ret.unshift({
        asset: (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
            <Image src={currentEthToken?.logo || ''} width={20} height={20} style={{ borderRadius: '50%' }}></Image>
            <Typography>{currentEthToken?.symbol || '-'}</Typography>
          </Box>
        ),
        price: '-',
        // balance: item.toSignificant(6, { groupSeparator: ',' }),
        balance: <Typography>{currentEthTokenBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'}</Typography>,
        daoName: <>-</>,
        value: '-'
      })
    }
    return ret
  }, [currentEthToken?.logo, currentEthToken?.symbol, currentEthTokenBalance, myTokens, walletPage.currentPage])
  const { result: myWalletHistory, page, loading } = useMyWalletHistory()

  return (
    <>
      {chainId && CROSS_SUPPORT_CREATE_NETWORK.includes(chainId) && (
        <Box mt={40} mb={-20} ml={40}>
          <Typography
            sx={{ cursor: 'pointer' }}
            fontWeight={500}
            display={'inline-flex'}
            onClick={() => history.push('/governance')}
            alignItems="center"
          >
            <ArrowBackIcon sx={{ height: 16 }}></ArrowBackIcon>Back
          </Typography>
        </Box>
      )}
      <StyledHeader>
        <Container display={'flex'} justifyContent={'space-between'} alignItems={'center'} minHeight={138}>
          <Box display={'flex'} gap={10}>
            <MyWalletIcon />
            <Typography variant="h5" fontSize={18} marginRight={-6}>
              {account}
            </Typography>
            <Copy toCopy={account || ''} size={24} />
          </Box>
        </Container>
      </StyledHeader>
      {account && (
        <StyledBox padding={'20px'}>
          <Container>
            <CreateTokenReservedList />
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
              <>
                <Table
                  className="stp-table"
                  loading={myTokensLoading}
                  dataSource={myTokenData}
                  rowKey={'id'}
                  pagination={false}
                >
                  <Column title="Asset" dataIndex="asset" key="id" align="center" />
                  {/* <Column title="Price" dataIndex="price" key="id" align="center" /> */}
                  <Column align="center" title="Balance" dataIndex="balance" key="quantity" />
                  {/* <Column title="Value" dataIndex="value" key="id" align="center" /> */}
                  <Column title="DAO Name" dataIndex="daoName" key="proposals" align="center" />
                </Table>
                <Box display={'flex'} justifyContent={'center'}>
                  <Pagination
                    simple
                    size="default"
                    hideOnSinglePage
                    pageSize={walletPage.pageSize}
                    style={{ marginTop: 20 }}
                    current={walletPage.currentPage}
                    total={walletPage.total}
                    onChange={e => walletPage.setCurrentPage(e)}
                  />
                </Box>
              </>
            )}
            {currentTab === 'History' && (
              <>
                {loading && (
                  <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
                    <Spin size="large" tip="Loading..." />
                  </Box>
                )}
                {!loading && myWalletHistory.length === 0 && (
                  <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
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

            {currentTab === 'My Created Token' && <MyCreateTokenList />}
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
        padding: '20px 52px'
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
  const { chainId } = useActiveWeb3React()
  const token = useToken(data.address)
  const bal = useMemo(() => {
    if (data.address === ZERO_ADDRESS) {
      return CurrencyAmount.ether(data.value)
    }
    if (!token) return undefined
    return new TokenAmount(token, data.value)
  }, [data.address, data.value, token])

  const symbol = useMemo(() => {
    if (data.address === ZERO_ADDRESS) return Currency.get_ETH_TOKEN(chainId || 1)?.symbol
    return token?.symbol
  }, [chainId, data.address, token?.symbol])

  return (
    <Typography variant="h6">
      {data.mark}
      {bal?.toSignificant(6, { groupSeparator: ',' })} {symbol}
    </Typography>
  )
}

function CreateTokenReservedList() {
  const createTokenReserved = useCreateTokenReserved()

  return (
    <Box display={'grid'} gap="10px">
      {createTokenReserved?.map((item, index) => (
        <Alert
          key={index}
          message={
            <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <Typography style={{ marginTop: 0 }}>
                You have{' '}
                <Link
                  target={'_blank'}
                  underline="none"
                  href={getEtherscanLink(item.tokenAmount.token.chainId, item.tokenAmount.token.address, 'address')}
                >
                  <b>
                    {item.tokenAmount.toSignificant(6, { groupSeparator: ',' })} {item.tokenAmount.token.symbol}
                  </b>
                </Link>{' '}
                available for claim on {timeStampToFormat(item.lockDate)}
              </Typography>
              <CreateTokenReservedClaim item={item} />
            </Box>
          }
        ></Alert>
      ))}
    </Box>
  )
}

function CreateTokenReservedClaim({ item }: { item: { tokenAmount: TokenAmount; lockDate: number } }) {
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const createERC20Claim = useCreateERC20ClaimCallback()
  const { claimSubmitted } = useUserHasSubmittedClaim(`${account}_${item.tokenAmount.token.address}`)

  const isLocked = useMemo(() => {
    const now = new Date().getTime()
    return now / 1000 - item.lockDate < 0
  }, [item.lockDate])

  const onReservedClaim = useCallback(() => {
    showModal(<TransactionPendingModal />)
    createERC20Claim(item.tokenAmount.token.address)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err, JSON.stringify(err))
      })
  }, [createERC20Claim, hideModal, item.tokenAmount.token.address, showModal])

  const getReservedActions = useMemo(() => {
    if (!account) {
      return null
    }
    if (claimSubmitted) {
      return (
        <Button width="100px" height="40px" disabled>
          Claiming
          <Dots />
        </Button>
      )
    }
    if (isLocked) {
      return (
        <Button width="100px" height="40px" disabled>
          Claim
        </Button>
      )
    }

    return (
      <Button width="100px" height="40px" onClick={onReservedClaim}>
        Claim
      </Button>
    )
  }, [account, claimSubmitted, isLocked, onReservedClaim])

  return getReservedActions
}

function MyCreateTokenList() {
  const { account } = useActiveWeb3React()
  const { list, loading, page } = useCreateTokenList()
  const showList = useMemo(
    () =>
      list.map(token => ({
        tokenInfo: (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
            <Image src={token?.logo || ''} width={20} height={20} style={{ borderRadius: '50%' }}></Image>
            <Typography>{token?.symbol || '-'}</Typography>
          </Box>
        ),
        address: (
          <Box display={'flex'} justifyContent="center">
            <Link
              key={0}
              target="_blank"
              href={getEtherscanLink(token.chainId, token.address, 'address')}
              display="flex"
              alignItems={'center'}
              justifyContent="center"
            >
              {shortenAddress(token.address)}
            </Link>
            <Copy toCopy={token.address} />
          </Box>
        ),
        balance: <ShowTokenBalance key={1} token={token} account={account || undefined} />
      })),
    [account, list]
  )

  return (
    <>
      <Table className="stp-table" loading={loading} dataSource={showList} rowKey={'id'} pagination={false}>
        <Column title="TokenInfo" dataIndex="tokenInfo" key="id" align="center" />
        <Column title="Address" dataIndex="address" key="proposals" align="center" />
        <Column align="center" title="Balance" dataIndex="balance" key="quantity" />
      </Table>
      <Box display={'flex'} justifyContent={'center'}>
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
  )
}
