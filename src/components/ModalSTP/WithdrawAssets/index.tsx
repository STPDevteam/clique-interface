import './pc.less'

import 'react'
import { Button, Input, Select } from 'antd'
import IconDownArrow from '../assets/icon-down-arrow.svg'
// import IconToken from '../../../assets/images/icon-token.svg'
import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { Token } from 'constants/token'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { tryParseAmount } from 'state/application/hooks'
import BigNumber from 'bignumber.js'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'theme/components'

const { Option } = Select

export default function WithdrawAssets({
  daoTokens,
  daoInfo,
  onWithdraw
}: {
  daoTokens: Token[]
  daoInfo: DaoInfoProps
  onWithdraw: (
    title: string,
    content: string,
    startTime: number,
    endTime: number,
    tokenAddress: string,
    amount: string
  ) => void
}) {
  const [tokenAddress, setTokenAddress] = useState<string>()
  const { account } = useActiveWeb3React()
  const [input, setInput] = useState('')
  const curToken = useMemo(() => daoTokens.find(item => item.address === tokenAddress), [daoTokens, tokenAddress])
  const curDaoBalance = useTokenBalance(daoInfo.daoAddress, curToken)
  const curAccountBalance = useTokenBalance(account || undefined, daoInfo.token)
  const [justification, setJustification] = useState('')
  const [approvalState, approvalCallback] = useApproveCallback(
    daoInfo.rule?.minimumCreateProposal,
    daoInfo.votingAddress
  )

  useEffect(() => {
    setInput('')
  }, [curToken])

  const inputBal = useMemo(() => tryParseAmount(input, curToken), [curToken, input])

  const onWithdrawCall = useCallback(() => {
    if (!daoInfo.rule?.contractVotingDuration || !justification || !tokenAddress || !inputBal) return
    const startTime = Number((new Date().getTime() / 1000).toFixed())
    const endTime = Number(daoInfo.rule.contractVotingDuration) + startTime
    onWithdraw(
      justification,
      `Withdraw ${inputBal.toSignificant()} ${curToken?.symbol}`,
      startTime,
      endTime,
      tokenAddress,
      inputBal.raw.toString()
    )
  }, [curToken?.symbol, daoInfo.rule?.contractVotingDuration, inputBal, justification, onWithdraw, tokenAddress])

  const getActions = useMemo(() => {
    if (!input || !inputBal || !daoInfo.daoAddress) return <Button disabled>Create a proposal</Button>
    if (!curAccountBalance || !daoInfo.rule || curAccountBalance?.lessThan(daoInfo.rule?.minimumCreateProposal)) {
      return <Button disabled>Balance Insufficient</Button>
    }
    if (!justification.trim()) return <Button disabled>Input justification</Button>

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return (
          <Button disabled>
            Approval
            <Dots />
          </Button>
        )
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return <Button onClick={approvalCallback}>Approval</Button>
      } else {
        return (
          <Button disabled>
            Loading
            <Dots />
          </Button>
        )
      }
    }
    return <Button onClick={onWithdrawCall}>Create a proposal</Button>
  }, [
    approvalCallback,
    approvalState,
    curAccountBalance,
    daoInfo.daoAddress,
    daoInfo.rule,
    input,
    inputBal,
    justification,
    onWithdrawCall
  ])

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
            <div className="kv">
              <span>Amount</span>
              <span>Balance: {curDaoBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'}</span>
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
                  if (new BigNumber(_val).gt(curDaoBalance?.toSignificant() || 0)) {
                    setInput(curDaoBalance?.toSignificant() || '0')
                  } else {
                    setInput(_val)
                  }
                }
              }}
            />
          </div>
          <div className="input-item">
            <span className="label">Justification</span>
            <Input
              placeholder="Withdraw tokens"
              maxLength={100}
              value={justification}
              onChange={e => setJustification(e.target.value)}
            />
          </div>
          <div className="kv mt-16">
            <span>Your balance</span>
            <span>
              {curAccountBalance?.toSignificant()} {daoInfo.token?.symbol}
            </span>
          </div>
          <div className="kv">
            <span>Minimum needed</span>
            <span>
              {daoInfo.rule?.minimumCreateProposal.toSignificant(6, { groupSeparator: ',' })} {daoInfo.token?.symbol}
            </span>
          </div>
          {getActions}
        </Box>
      </Box>
    </Modal>
  )
}
