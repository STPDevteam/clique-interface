import './pc.less'

import 'react'
import { Button, Input, Select } from 'antd'
import IconDownArrow from '../assets/icon-down-arrow.svg'
// import IconToken from '../../../assets/images/icon-token.svg'
import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import { Token } from 'constants/token'
import { useEffect, useMemo, useState } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import BigNumber from 'bignumber.js'
import { tryParseAmount } from 'state/application/hooks'

const { Option } = Select

export default function DepositAssets({
  daoTokens,
  daoAddress,
  onDeposit
}: {
  daoTokens: Token[]
  daoAddress: string
  onDeposit: (to: string, value: string) => void
}) {
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [input, setInput] = useState('')
  const { account } = useActiveWeb3React()
  const curToken = useMemo(() => daoTokens.find(item => item.address === tokenAddress), [daoTokens, tokenAddress])
  const curBalance = useTokenBalance(account || undefined, curToken)

  useEffect(() => {
    setInput('')
  }, [curToken])

  const getActions = useMemo(() => {
    const _bal = tryParseAmount(input, curToken)
    if (!input || !_bal || !daoAddress) return <Button disabled>Submit</Button>
    return <Button onClick={() => onDeposit(daoAddress, _bal.raw.toString())}>Submit</Button>
  }, [curToken, daoAddress, input, onDeposit])

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
              <img src={curToken?.logo || ''} />
              <Select defaultValue="" onChange={e => setTokenAddress(e)} suffixIcon={<img src={IconDownArrow} />}>
                <Option value="">Select assets</Option>
                {daoTokens.map(item => (
                  <Option key={item.address} value={item.address}>
                    {item.symbol}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="input-item">
            <div className="label">
              <span>Amount</span>
              <span>Balance: {curBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'}</span>
            </div>
            <Input
              placeholder="0.00"
              value={input}
              maxLength={12}
              onChange={e => {
                const _val = e.target.value
                if (isNaN(Number(_val))) return
                const reg = new RegExp('^[0-9.]*$')
                if (reg.test(_val)) {
                  if (new BigNumber(_val).gt(curBalance?.toSignificant() || 0)) {
                    setInput(curBalance?.toSignificant() || '0')
                  } else {
                    setInput(_val)
                  }
                }
              }}
            />
          </div>
          {/* <div className="input-item">
            <span className="label">Memo</span>
            <Input placeholder="Deposit tokens" />
          </div> */}
          {getActions}
        </Box>
      </Box>
    </Modal>
  )
}
