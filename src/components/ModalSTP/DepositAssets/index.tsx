import './pc.less'

import 'react'
import { Input, Select } from 'antd'
import Button from 'components/Button/Button'
import IconDownArrow from '../assets/icon-down-arrow.svg'
// import IconToken from '../../../assets/images/icon-token.svg'
import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import { ETHER, Token } from 'constants/token'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import BigNumber from 'bignumber.js'
import { tryParseAmount } from 'state/application/hooks'
import { ZERO_ADDRESS } from '../../../constants'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTokenTransferCallback } from 'hooks/useTokenTransferCallback'
import useModal from 'hooks/useModal'

const { Option } = Select

export default function DepositAssets({ daoTokens, daoAddress }: { daoTokens: Token[]; daoAddress: string }) {
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [input, setInput] = useState('')
  const { account } = useActiveWeb3React()
  const curToken = useMemo(() => daoTokens.find(item => item.address === tokenAddress), [daoTokens, tokenAddress])
  const curBalance = useCurrencyBalance(account || undefined, curToken?.address === ZERO_ADDRESS ? ETHER : curToken)
  const { showModal, hideModal } = useModal()

  useEffect(() => {
    setInput('')
  }, [curToken])

  const onTokenTransferCallback = useTokenTransferCallback(tokenAddress)
  const onDepositCallback = useCallback(
    (to: string, value: string, isETHER: boolean) => {
      showModal(<TransactionPendingModal />)
      onTokenTransferCallback(to, value, isETHER)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">
              {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
            </MessageBox>
          )
          console.error(err)
        })
    },
    [showModal, onTokenTransferCallback, hideModal]
  )

  const getActions = useMemo(() => {
    const _bal = tryParseAmount(input, curToken)
    if (!input || !_bal || !daoAddress)
      return (
        <Button disabled width="240px">
          Submit
        </Button>
      )
    return (
      <Button
        width="240px"
        onClick={() => onDepositCallback(daoAddress, _bal.raw.toString(), tokenAddress === ZERO_ADDRESS)}
      >
        Submit
      </Button>
    )
  }, [curToken, daoAddress, input, onDepositCallback, tokenAddress])

  return (
    <Modal closeIcon>
      <Box display="grid" gap="20px" width="100%">
        <Typography variant="h4" fontWeight={500} fontSize={24}>
          Deposit assets
        </Typography>
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
              <Select
                defaultValue=""
                onChange={e => {
                  setTokenAddress(e)
                }}
                suffixIcon={<img src={IconDownArrow} />}
              >
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
          <Box display={'flex'} justifyContent={'center'} mt={10}>
            {getActions}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
