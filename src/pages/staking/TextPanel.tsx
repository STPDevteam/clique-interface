import { Box, styled, Typography } from '@mui/material'
import { Collapse } from 'antd'

const { Panel } = Collapse
const StyledCollapseBox = styled(Box)({
  '.ant-collapse': {
    width: '100%',
    border: 'none',
    '.ant-collapse-item': {
      borderBottom: 'none'
    }
  },
  '.ant-collapse .ant-collapse-item:nth-child(n + 2)': {
    marginTop: 10
  },
  '.ant-collapse .ant-collapse-header': {
    height: 48,
    fontSize: 14,
    color: '#22304A',
    background: '#FFFFFF',
    border: '0.5px solid #D8D8D8',
    boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
    borderRadius: '8px !important'
  },
  '.ant-collapse .ant-collapse-content': {
    padding: '11px 32px',
    background: '#FAFAFA',
    boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
    borderRadius: '8px !important',
    marginTop: '2px'
  },
  '.ant-collapse-content > .ant-collapse-content-box': {
    padding: 0
  }
})

const Text = styled(Typography)({
  color: '#798488',
  fontSize: '14px'
})

export default function TextPanel() {
  return (
    <StyledCollapseBox>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="What is the use of stake STPT" key="1">
          <Text>Stake STPT(ERC20) to earn more tokens.</Text>
        </Panel>
        <Panel header="How weighted values are calculated" key="2">
          <Text>Stake STPT(ERC20) to earn more tokens.</Text>
        </Panel>
        <Panel header="Is there a time limit on claims" key="3">
          <Text>Stake STPT(ERC20) to earn more tokens.</Text>
          <Text>Stake STPT(ERC20) to earn more tokens.</Text>
          <Text>Stake STPT(ERC20) to earn more tokens.</Text>
        </Panel>
      </Collapse>
    </StyledCollapseBox>
  )
}
