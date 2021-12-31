import './pc.less'

import 'react'
import { Button, Input, Select } from 'antd'
import IconDownArrow from '../assets/icon-down-arrow.svg'
import IconToken from '../../../assets/images/icon-token.svg'
import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'

const { Option } = Select

export default function DepositAssets() {
  return (
    <Modal closeIcon>
      <Box display="grid" gap="20px" width="100%">
        <Typography variant="h6">Deposit assets</Typography>
        <Box
          display={'grid'}
          justifyContent={'center'}
          gridTemplateColumns={'1fr'}
          gap="10px"
          className="deposit-assets"
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
            <div className="label">
              <span>Amount</span>
              <span>Balance: 1000,000</span>
            </div>
            <Input placeholder="0.00" />
          </div>
          <div className="input-item">
            <span className="label">Memo</span>
            <Input placeholder="Deposit tokens" />
          </div>
          <Button>Submit</Button>
        </Box>
      </Box>
    </Modal>
  )
}
