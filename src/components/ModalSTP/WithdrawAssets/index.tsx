import './pc.less'

import 'react'
import { Input, Select } from 'antd'
import IconDownArrow from '../assets/icon-down-arrow.svg'
// import IconToken from '../../../assets/images/icon-token.svg'
import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { ETHER, Token } from 'constants/token'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { tryParseAmount } from 'state/application/hooks'
import BigNumber from 'bignumber.js'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'theme/components'
import { styled } from '@mui/system'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import { getCurrentTimeStamp, timeStampToFormat } from 'utils/dao'
import { ZERO_ADDRESS } from '../../../constants'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { useCreateContractProposalCallback } from 'hooks/useCreateContractProposalCallback'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const { Option } = Select

export default function WithdrawAssets({ daoTokens, daoInfo }: { daoTokens: Token[]; daoInfo: DaoInfoProps }) {
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [showConfirm, setShowConfirm] = useState(false)
  const { account } = useActiveWeb3React()
  const [input, setInput] = useState('')
  const curToken = useMemo(() => daoTokens.find(item => item.address === tokenAddress), [daoTokens, tokenAddress])
  const curDaoBalance = useCurrencyBalance(daoInfo.daoAddress, curToken?.address === ZERO_ADDRESS ? ETHER : curToken)
  const curAccountBalance = useCurrencyBalance(account || undefined, daoInfo.token)
  const [justification, setJustification] = useState('')
  const { showModal, hideModal } = useModal()
  const [approvalState, approvalCallback] = useApproveCallback(
    daoInfo.rule?.minimumCreateProposal,
    daoInfo.votingAddress
  )

  useEffect(() => {
    setInput('')
  }, [curToken])

  const inputBal = useMemo(() => tryParseAmount(input, curToken), [curToken, input])

  const startTime = getCurrentTimeStamp()
  const endTime = useMemo(() => Number(daoInfo?.rule?.contractVotingDuration || 0) + startTime, [
    daoInfo?.rule?.contractVotingDuration,
    startTime
  ])

  const { withdrawAssetCallback } = useCreateContractProposalCallback(daoInfo.votingAddress)
  const onWithdrawCallback = useCallback(
    (title: string, content: string, startTime: number, endTime: number, tokenAddress: string, amount: string) => {
      showModal(<TransactionPendingModal />)
      withdrawAssetCallback(title, content, tokenAddress, amount)
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
    [showModal, withdrawAssetCallback, hideModal]
  )

  const onWithdrawCall = useCallback(() => {
    if (!daoInfo.rule?.contractVotingDuration || !justification || !tokenAddress || !inputBal) return
    onWithdrawCallback(
      justification,
      `Withdraw ${inputBal.toSignificant()} ${curToken?.symbol}`,
      startTime,
      endTime,
      tokenAddress,
      inputBal.raw.toString()
    )
  }, [
    curToken?.symbol,
    daoInfo.rule?.contractVotingDuration,
    endTime,
    inputBal,
    justification,
    onWithdrawCallback,
    startTime,
    tokenAddress
  ])

  const getActions = useMemo(() => {
    if (!input || !inputBal || !daoInfo.daoAddress)
      return (
        <Button disabled width="240px">
          Create a proposal
        </Button>
      )
    if (!curAccountBalance || !daoInfo.rule || curAccountBalance?.lessThan(daoInfo.rule?.minimumCreateProposal)) {
      return (
        <Button width="240px" disabled>
          Balance Insufficient
        </Button>
      )
    }
    if (!justification.trim())
      return (
        <Button width="240px" disabled>
          Input justification
        </Button>
      )

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return (
          <Button disabled width="240px">
            Approval
            <Dots />
          </Button>
        )
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return (
          <Button width="240px" onClick={approvalCallback}>
            Approval
          </Button>
        )
      } else {
        return (
          <Button disabled width="240px">
            Loading
            <Dots />
          </Button>
        )
      }
    }
    return (
      <Button width="240px" onClick={() => setShowConfirm(true)}>
        Create a proposal
      </Button>
    )
  }, [
    approvalCallback,
    approvalState,
    curAccountBalance,
    daoInfo.daoAddress,
    daoInfo.rule,
    input,
    inputBal,
    justification
  ])

  return (
    <Modal closeIcon>
      {showConfirm ? (
        <>
          <Typography variant="h4" fontWeight={500} fontSize={24}>
            Confirm Proposal
          </Typography>
          <Box display={'grid'} gap={5} mt={30}>
            <Typography variant="body1">Your Proposal</Typography>
            <Typography variant="h6">{justification}</Typography>
            <FlexBetween mt={20}>
              <Typography variant="body1">Start time</Typography>
              <Typography variant="h6">{timeStampToFormat(startTime)}</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="body1">End time</Typography>
              <Typography variant="h6">{timeStampToFormat(endTime)}</Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="body1">You will stake</Typography>
              <Typography variant="h6">
                {daoInfo.rule?.minimumCreateProposal.toSignificant(6, { groupSeparator: ',' })} {daoInfo.token?.symbol}
              </Typography>
            </FlexBetween>
            <Box sx={{ backgroundColor: '#FAFAFA', padding: '14px 20px', borderRadius: '8px', margin: '20px 0' }}>
              <Typography variant="body1">
                Are you sure you want to vote for the above choice? This action cannot be undone.
              </Typography>
            </Box>

            <FlexBetween>
              <OutlineButton width={120} onClick={() => setShowConfirm(false)}>
                Cancel
              </OutlineButton>
              <Button width="240px" style={{ maxWidth: '65%' }} onClick={onWithdrawCall}>
                Stake {daoInfo.token?.symbol} and Create
              </Button>
            </FlexBetween>
          </Box>
        </>
      ) : (
        <Box display="grid" gap="20px" width="100%">
          <Typography variant="h4" fontWeight={500} fontSize={24}>
            Withdraw Assets
          </Typography>
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
              <span>Stake to create proposal</span>
              <span>
                {daoInfo.rule?.minimumCreateProposal.toSignificant(6, { groupSeparator: ',' })} {daoInfo.token?.symbol}
              </span>
            </div>
            <Box display={'flex'} justifyContent={'center'} mt={10}>
              {getActions}
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  )
}
