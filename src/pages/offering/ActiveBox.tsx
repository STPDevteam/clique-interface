import { Tabs } from 'antd'
import { Box, styled, Typography } from '@mui/material'
import { useState } from 'react'
import { ExternalLink } from 'theme/components'
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
export default function ActiveBox() {
  const [tab, setTab] = useState<OfferingActiveProps>(OfferingActiveProps.PAY)
  return (
    <StyledActiveBox>
      <Tabs
        onChange={e => setTab(e as OfferingActiveProps)}
        defaultActiveKey={tab}
        tabBarExtraContent={<Typography variant="h6">Activity</Typography>}
      >
        <TabPane tab={OfferingActiveProps.PAY} key={OfferingActiveProps.PAY}>
          <StyledItem>
            <FlexBetween>
              <Typography>Paid</Typography>
              <Typography>2021-12-16 16:05:50</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="h6">Swap 1,000 STPT to 2,000 DCC</Typography>
              <ExternalLink style={{ fontSize: 16 }} href="">
                0xba0a...8a4372
              </ExternalLink>
            </FlexBetween>
          </StyledItem>
        </TabPane>
        <TabPane tab={OfferingActiveProps.REDEEM} key={OfferingActiveProps.REDEEM}>
          <StyledItem>
            <FlexBetween>
              <Typography>Redeemed</Typography>
              <Typography>2021-12-16 16:05:50</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="h6">Swap 1,000 STPT to 2,000 DCC</Typography>
              <ExternalLink style={{ fontSize: 16 }} href="">
                0xba0a...8a4372
              </ExternalLink>
            </FlexBetween>
          </StyledItem>
          <StyledItem>
            <FlexBetween>
              <Typography>Redeemed</Typography>
              <Typography>2021-12-16 16:05:50</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="h6">Swap 1,000 STPT to 2,000 DCC</Typography>
              <ExternalLink style={{ fontSize: 16 }} href="">
                0xba0a...8a4372
              </ExternalLink>
            </FlexBetween>
          </StyledItem>
          <StyledItem>
            <FlexBetween>
              <Typography>Redeemed</Typography>
              <Typography>2021-12-16 16:05:50</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="h6">Swap 1,000 STPT to 2,000 DCC</Typography>
              <ExternalLink style={{ fontSize: 16 }} href="">
                0xba0a...8a4372
              </ExternalLink>
            </FlexBetween>
          </StyledItem>
        </TabPane>
      </Tabs>
    </StyledActiveBox>
  )
}
