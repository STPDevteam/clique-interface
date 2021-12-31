import './pc.less'

import 'react'
import { Button, Input, Select } from 'antd'
import IconDownArrow from '../assets/icon-down-arrow.svg'
import IconToken from '../../../assets/images/icon-token.svg'
import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'

const { Option } = Select

export default function WithdrawAssets() {
  return (
    <Modal closeIcon>
      <Box display="grid" gap="20px" width="100%">
        <Typography variant="h6">Withdraw Assets</Typography>
        <Box
          display={'grid'}
          justifyContent={'center'}
          gridTemplateColumns={'1fr'}
          gap="10px"
          className="withdraw-assets"
        >
          <div className="input-item">
            <span className="label">Asset</span>
            <div className="assets-selector">
              <img src={IconToken} />
              <Select defaultValue="Verse Network (STPT)" suffixIcon={<img src={IconDownArrow} />}>
                <Option value="Verse Network (STPT)">Verse Network (STPT)</Option>
              </Select>
            </div>
          </div>
          <div className="input-item">
            <div className="kv">
              <span>Amount</span>
              <span>Balance: 1000,000</span>
            </div>
            <Input placeholder="0.00" />
          </div>
          <div className="input-item">
            <span className="label">Justification</span>
            <Input placeholder="Withdraw tokens" />
          </div>
          <div className="kv mt-16">
            <span>Your balance</span>
            <span>0 DOC</span>
          </div>
          <div className="kv">
            <span>Minimum DDC needed</span>
            <span>2,000 DDC</span>
          </div>
          <Button>Create a proposal</Button>
        </Box>
      </Box>
    </Modal>
  )
}
