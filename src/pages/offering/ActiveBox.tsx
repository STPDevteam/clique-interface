import { Empty, Pagination, Spin, Tabs } from 'antd'
import { Box, styled, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { ExternalLink } from 'theme/components'
import {
  OfferingReservedProp,
  OfferingSwapProp,
  useOfferingReservedRecord,
  useOfferingSwapRecord
} from 'hooks/useBackedServer'
import { shortenHashAddress, timeStampToFormat } from 'utils/dao'
import { getEtherscanLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { DefaultChainId } from '../../constants'
import { Token, TokenAmount } from 'constants/token'
import { useReceiveToken } from 'hooks/useDaoTokenInfo'
const { TabPane } = Tabs

const StyledActiveBox = styled(Box)({
  '& .ant-tabs-nav-container': {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  '& .ant-tabs-tab': {
    fontWeight: 600,
    fontSize: 16
  },
  '& .ant-tabs-extra-content': {
    float: 'left !important',
    paddingTop: 10
  }
})
const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})
const StyledItem = styled(Box)({
  height: 80,
  padding: '20px 48px',
  border: '0.5px solid #D8D8D8',
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  borderRadius: 8,
  margin: '0 8px 8px 0'
})

export enum OfferingActiveProps {
  PAY = 'Pay',
  REDEEM = 'Redeem'
}
export default function ActiveBox({ daoAddress, daoToken }: { daoAddress: string | undefined; daoToken: Token }) {
  const { loading: swapLoading, swap: swapList, page: swapPage } = useOfferingSwapRecord(daoAddress)
  const { loading: reservedLoading, reserved: reservedList } = useOfferingReservedRecord(daoAddress)
  const receiveToken = useReceiveToken(daoAddress)
  const [tab, setTab] = useState<OfferingActiveProps>(OfferingActiveProps.PAY)
  return (
    <StyledActiveBox>
      <Tabs
        onChange={e => setTab(e as OfferingActiveProps)}
        defaultActiveKey={tab}
        tabBarExtraContent={<Typography variant="h6">Activity</Typography>}
      >
        <TabPane tab={OfferingActiveProps.PAY} key={OfferingActiveProps.PAY}>
          {swapLoading && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Spin size="large" tip="Loading..." />
            </Box>
          )}
          {!swapLoading && swapList.length === 0 && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Empty description="No records currently" />
            </Box>
          )}
          {!swapLoading &&
            swapList.map((item, index) => (
              <SwapItem receiveToken={receiveToken} daoToken={daoToken} key={index} item={item} />
            ))}
          <Box display={'flex'} justifyContent={'center'} mb={10}>
            <Pagination
              simple
              size="default"
              hideOnSinglePage
              pageSize={swapPage.pageSize}
              style={{ marginTop: 20 }}
              current={swapPage.currentPage}
              total={swapPage.total}
              onChange={e => swapPage.setCurrentPage(e)}
            />
          </Box>
        </TabPane>
        <TabPane tab={OfferingActiveProps.REDEEM} key={OfferingActiveProps.REDEEM}>
          {reservedLoading && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Spin size="large" tip="Loading..." />
            </Box>
          )}
          {!reservedLoading && reservedList.length === 0 && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
              <Empty description="No records currently" />
            </Box>
          )}
          {!reservedLoading &&
            reservedList.map((item, index) => <ReservedItem daoToken={daoToken} key={index} item={item} />)}
        </TabPane>
      </Tabs>
    </StyledActiveBox>
  )
}

function SwapItem({
  item,
  daoToken,
  receiveToken
}: {
  item: OfferingSwapProp
  daoToken: Token
  receiveToken: Token | undefined
}) {
  const { chainId } = useActiveWeb3React()
  const daoTokenAmount = useMemo(() => new TokenAmount(daoToken, item.daoAmt), [daoToken, item.daoAmt])
  const receiveTokenAmount = useMemo(
    () => (receiveToken ? new TokenAmount(receiveToken, item.receiveAmt) : undefined),
    [item.receiveAmt, receiveToken]
  )

  return (
    <StyledItem>
      <FlexBetween>
        <Typography>Paid</Typography>
        <Typography>{timeStampToFormat(item.timeStamp)}</Typography>
      </FlexBetween>
      <FlexBetween>
        <Typography variant="h6">
          Swap {receiveTokenAmount?.toSignificant(6, { groupSeparator: ',' }) || '-'} {receiveToken?.symbol} to{' '}
          {daoTokenAmount.toSignificant(6, { groupSeparator: ',' })} {daoToken.symbol}
        </Typography>
        <ExternalLink
          style={{ fontSize: 16 }}
          href={getEtherscanLink(chainId || DefaultChainId, item.hash, 'transaction')}
        >
          {shortenHashAddress(item.hash)}
        </ExternalLink>
      </FlexBetween>
    </StyledItem>
  )
}

function ReservedItem({ item, daoToken }: { item: OfferingReservedProp; daoToken: Token }) {
  const { chainId } = useActiveWeb3React()
  const daoTokenAmount = useMemo(() => new TokenAmount(daoToken, item.daoAmt), [daoToken, item.daoAmt])

  return (
    <StyledItem>
      <FlexBetween>
        <Typography>Redeemed</Typography>
        <Typography>{timeStampToFormat(item.timeStamp)}</Typography>
      </FlexBetween>
      <FlexBetween>
        <Typography variant="h6">
          Claim {daoTokenAmount.toSignificant(6, { groupSeparator: ',' })} {daoToken.symbol}
        </Typography>
        <ExternalLink
          style={{ fontSize: 16 }}
          href={getEtherscanLink(chainId || DefaultChainId, item.hash, 'transaction')}
        >
          {shortenHashAddress(item.hash)}
        </ExternalLink>
      </FlexBetween>
    </StyledItem>
  )
}
