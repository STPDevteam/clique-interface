import '../../../DaoDetail/components/Configuration/pc.less'

import 'react'
import { Input, Slider, Tooltip, Switch, InputNumber } from 'antd'
import { Box, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import AlertError from 'components/Alert/index'
import { amountAddDecimals, getCurrentTimeStamp, toFormatGroup } from 'utils/dao'
import { calcVotingDuration, getAmountForPer, getPerForAmount } from 'pages/building/function'
import BigNumber from 'bignumber.js'
import JSBI from 'jsbi'
import TextArea from 'antd/lib/input/TextArea'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { TokenAmount } from 'constants/token'
import Confirm from './Confirm'
import { useActiveWeb3React } from 'hooks'
import OutlineButton from 'components/Button/OutlineButton'
import { calcTime } from 'utils'
import { useCreateCrossContractProposalCallback } from 'hooks/useCreateContractProposalCallback'
import { getCreateProposalSign } from 'utils/fetch/server'

// const { TextArea } = Input

export default function Configuration({
  rule,
  totalSupply,
  votingAddress,
  daoAddress
}: {
  rule: {
    minimumVote: TokenAmount
    minimumCreateProposal: TokenAmount
    minimumValidVotes: TokenAmount
    communityVotingDuration: string
    contractVotingDuration: string
    content: string
  }
  totalSupply: TokenAmount
  votingAddress: string | undefined
  daoAddress: string
}) {
  const { account, chainId } = useActiveWeb3React()
  const { hideModal, showModal } = useModal()
  const [minVoteNumber, setMinVoteNumber] = useState(rule.minimumVote.toSignificant())
  const [minCreateProposalNumber, setMinCreateProposalNumber] = useState(rule?.minimumCreateProposal.toSignificant())
  const [minValidNumber, setMinValidNumber] = useState(rule.minimumValidVotes.toSignificant())
  // const [minVotePer, setMinVotePer] = useState(
  //   getPerForAmount(totalSupply.toSignificant(), rule.minimumVote.toSignificant())
  // )
  const [minCreateProposalPer, setMinCreateProposalPer] = useState(
    getPerForAmount(totalSupply.toSignificant(), rule.minimumCreateProposal.toSignificant())
  )
  const [minValidPer, setMinValidPer] = useState(
    getPerForAmount(totalSupply.toSignificant(), rule?.minimumValidVotes.toSignificant())
  )

  const [votersCustom, setVotersCustom] = useState(!JSBI.GT(JSBI.BigInt(rule.communityVotingDuration), JSBI.BigInt(0)))

  const [communityData, setCommunityData] = useState(calcTime(Number(rule?.communityVotingDuration || 0)))
  const [contractData, setContractData] = useState(calcTime(Number(rule?.contractVotingDuration || 0)))

  const [ruleContent, setRuleContent] = useState(rule.content)

  const updateConfigurationCallback = useCreateCrossContractProposalCallback(votingAddress)

  const verifyMsg = useMemo(() => {
    if (!minVoteNumber || !minCreateProposalNumber || !minValidNumber) return 'Votes required'
    if (!votersCustom) {
      if (!communityData.days && !communityData.hours && !communityData.minutes) {
        return 'Community Voting Duration required'
      }
    }
    if (!contractData.days && !contractData.hours && !contractData.minutes) {
      return 'Contract Voting Duration required'
    }
    return undefined
  }, [communityData, contractData, minCreateProposalNumber, minValidNumber, minVoteNumber, votersCustom])

  const startTime = getCurrentTimeStamp()
  const endTime = useMemo(() => Number(rule?.contractVotingDuration || 0) + startTime, [
    rule?.contractVotingDuration,
    startTime
  ])

  const communityDuration = useMemo(
    () =>
      votersCustom
        ? '0'
        : calcVotingDuration(communityData.days, communityData.hours, communityData.minutes).toString(),
    [communityData.days, communityData.hours, communityData.minutes, votersCustom]
  )
  const contractDuration = useMemo(
    () => calcVotingDuration(contractData.days, contractData.hours, contractData.minutes).toString(),
    [contractData]
  )

  const updateLog = useMemo(() => {
    const logArr: { [key in string]: string[] } = {}
    if (minVoteNumber !== rule.minimumVote.toSignificant()) {
      logArr['Minimum holding to vote'] = [rule.minimumVote.toSignificant(6, { groupSeparator: ',' }), minVoteNumber]
    }
    if (minCreateProposalNumber !== rule.minimumCreateProposal.toSignificant()) {
      logArr['Minimum holding to create proposal'] = [
        rule.minimumCreateProposal.toSignificant(6, { groupSeparator: ',' }),
        minCreateProposalNumber
      ]
    }
    if (minValidNumber !== rule.minimumValidVotes.toSignificant()) {
      logArr['Minimum total votes'] = [rule.minimumValidVotes.toSignificant(6, { groupSeparator: ',' }), minValidNumber]
    }
    if (communityDuration !== rule.communityVotingDuration) {
      const _new = calcTime(Number(communityDuration))
      const _old = calcTime(Number(rule.communityVotingDuration))
      logArr['Community Voting Duration'] = [
        `${_old.days} Days ${_old.hours} Hours ${_old.minutes} Minutes ${
          Number(rule.communityVotingDuration) === 0 ? '(voters custom)' : ''
        }`,
        `${_new.days} Days ${_new.hours} Hours ${_new.minutes} Minutes ${
          Number(communityDuration) === 0 ? '(voters custom)' : ''
        }`
      ]
    }
    if (contractDuration !== rule.contractVotingDuration) {
      const _new = calcTime(Number(contractDuration))
      const _old = calcTime(Number(rule.contractVotingDuration))
      logArr['Contract Voting Duration'] = [
        `${_old.days} Days ${_old.hours} Hours ${_old.minutes} Minutes`,
        `${_new.days} Days ${_new.hours} Hours ${_new.minutes} Minutes`
      ]
    }
    if (ruleContent !== rule.content) {
      logArr['Rules / Agreement'] = [rule.content, ruleContent]
    }
    const ret: string[] = []
    for (const key in logArr) {
      if (Object.prototype.hasOwnProperty.call(logArr, key)) {
        const item = logArr[key]
        ret.push(`${key}: ${item[0]} --> ${item[1]}`)
      }
    }
    return ret.join(' <br /> ')
  }, [
    communityDuration,
    contractDuration,
    minCreateProposalNumber,
    minValidNumber,
    minVoteNumber,
    rule.communityVotingDuration,
    rule.content,
    rule.contractVotingDuration,
    rule.minimumCreateProposal,
    rule.minimumValidVotes,
    rule.minimumVote,
    ruleContent
  ])

  const onCommit = useCallback(async () => {
    if (!chainId || !totalSupply || !account) return
    showModal(<TransactionPendingModal />)
    try {
      const res = await getCreateProposalSign(chainId, totalSupply.token.chainId, daoAddress, account)
      const votInfo = res.data.data
      if (!votInfo) {
        showModal(<MessageBox type="error">get sign failed</MessageBox>)
        return
      }
      const backTA = new TokenAmount(totalSupply.token, votInfo.balance)
      if (!backTA || backTA.lessThan(rule.minimumCreateProposal)) {
        showModal(<MessageBox type="error">Balance Insufficient</MessageBox>)
        return
      }
      updateConfigurationCallback(
        'Update Contract Configuration',
        updateLog,
        amountAddDecimals(minVoteNumber, totalSupply.token.decimals),
        amountAddDecimals(minCreateProposalNumber, totalSupply.token.decimals),
        amountAddDecimals(minValidNumber, totalSupply.token.decimals),
        Number(communityDuration),
        Number(contractDuration),
        ruleContent,
        {
          user: votInfo.userAddress,
          weight: votInfo.balance,
          chainId: votInfo.chainId,
          voting: votInfo.votingAddress,
          nonce: votInfo.nonce
        },
        votInfo.sign
      )
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
    } catch (error) {
      showModal(<MessageBox type="error">get sign failed</MessageBox>)
    }
  }, [
    account,
    chainId,
    communityDuration,
    contractDuration,
    daoAddress,
    hideModal,
    minCreateProposalNumber,
    minValidNumber,
    minVoteNumber,
    rule.minimumCreateProposal,
    ruleContent,
    showModal,
    totalSupply,
    updateConfigurationCallback,
    updateLog
  ])

  const onUpdateConfirm = useCallback(() => {
    showModal(
      <Confirm
        minimumCreateProposal={rule.minimumCreateProposal}
        onCommit={onCommit}
        startTime={startTime}
        endTime={endTime}
        updateLog={updateLog}
      />
    )
  }, [endTime, onCommit, rule.minimumCreateProposal, showModal, startTime, updateLog])

  return (
    <section className="configuration">
      <h1>Configuration</h1>
      <Box mb={20} mt={20}>
        <Typography>Governance contract address</Typography>
        <Typography variant="h6" fontSize={14}>
          {votingAddress}
        </Typography>
      </Box>
      <Box mb={20} mt={20}>
        <Typography>Token Contract Address</Typography>
        <Typography variant="h6" fontSize={14}>
          {totalSupply.token.address}
        </Typography>
      </Box>
      <Box display="grid" gap="10px">
        <Box display={'flex'} justifyContent={'space-between'} mb={20} mt={10}>
          <Typography variant="h6">Total Supply</Typography>
          <Typography variant="h6">
            {totalSupply.toSignificant(6, { groupSeparator: ',' })} {totalSupply.token.symbol}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <div className="input-item progress">
            <span className="label">Minimum holding to vote</span>
            {/* <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minVotePer}
                onChange={e => {
                  setMinVotePer(e as number)
                  setMinVoteNumber(getAmountForPer(totalSupply.toSignificant(), e as number))
                }}
              />
              <span>{Number(minVotePer.toFixed(2))}%</span>
            </div> */}
          </div>
          <div className="input-item votes">
            {/* <span className="label">Votes</span> */}
            <Box>
              <Tooltip placement="top" title={toFormatGroup(minVoteNumber, 0)}>
                <Input
                  className="input-common"
                  value={minVoteNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      // check max value
                      const input = new BigNumber(_val).gt(totalSupply.toSignificant())
                        ? totalSupply.toSignificant()
                        : _val
                      setMinVoteNumber(input)
                      // setMinVotePer(getPerForAmount(totalSupply.toSignificant(), input))
                    }
                  }}
                />
              </Tooltip>
              <span className="label"> {totalSupply.token.symbol}</span>
            </Box>
          </div>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <div className="input-item progress">
            <span className="label">Minimum holding to create proposal</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minCreateProposalPer}
                onChange={e => {
                  setMinCreateProposalPer(e as number)
                  setMinCreateProposalNumber(getAmountForPer(totalSupply.toSignificant(), e as number))
                }}
              />
              <span>{Number(minCreateProposalPer.toFixed(2))}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Tokens</span>
            <Box>
              <Tooltip placement="top" title={toFormatGroup(minCreateProposalNumber)}>
                <Input
                  className="input-common"
                  value={minCreateProposalNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      // check max value
                      const input = new BigNumber(_val).gt(totalSupply.toSignificant())
                        ? totalSupply.toSignificant()
                        : _val
                      setMinCreateProposalNumber(input)
                      setMinCreateProposalPer(getPerForAmount(totalSupply.toSignificant(), input))
                    }
                  }}
                />
              </Tooltip>
              <span className="label"> {totalSupply.token.symbol}</span>
            </Box>
          </div>
        </Box>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <div className="input-item progress">
            <span className="label">Minimum total votes</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minValidPer}
                onChange={e => {
                  setMinValidPer(e as number)
                  setMinValidNumber(getAmountForPer(totalSupply.toSignificant(), e as number))
                }}
              />
              <span>{Number(minValidPer.toFixed(2))}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Tooltip placement="top" title={toFormatGroup(minValidNumber)}>
              <Input
                className="input-common w100"
                value={minValidNumber}
                onChange={e => {
                  const reg = new RegExp('^[0-9]*$')
                  const _val = e.target.value
                  if (reg.test(_val)) {
                    // check max value
                    const input = new BigNumber(_val).gt(totalSupply.toSignificant())
                      ? totalSupply.toSignificant()
                      : _val
                    setMinValidNumber(input)
                    setMinValidPer(getPerForAmount(totalSupply.toSignificant(), input))
                  }
                }}
              />
            </Tooltip>
          </div>
        </Box>

        <Box display={'grid'} gap="15px">
          <div className="input-item">
            <span className="label">Voting Duration for Proposals with Manual Execution</span>
            <Box display={'flex'} justifyContent={'space-between'} gap={20} width={'100%'}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div className="datetime-wrapper">
                  <InputNumber
                    min={0}
                    className="input-number-common"
                    value={communityData.days}
                    disabled={votersCustom}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) {
                        setCommunityData(
                          Object.assign({
                            ...communityData,
                            days: _val
                          })
                        )
                      }
                    }}
                  />
                  <span>Days</span>
                </div>
                <div className="datetime-wrapper">
                  <InputNumber
                    min={0}
                    className="input-number-common"
                    value={communityData.hours}
                    max={23}
                    disabled={votersCustom}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) {
                        setCommunityData(
                          Object.assign({
                            ...communityData,
                            hours: _val
                          })
                        )
                      }
                    }}
                  />
                  <span>Hours</span>
                </div>
                <div className="datetime-wrapper">
                  <InputNumber
                    min={0}
                    className="input-number-common"
                    value={communityData.minutes}
                    disabled={votersCustom}
                    max={59}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) {
                        setCommunityData(
                          Object.assign({
                            ...communityData,
                            minutes: _val
                          })
                        )
                      }
                    }}
                  />
                  <span>Minutes</span>
                </div>
              </Box>
              <Box display={'flex'} alignItems={'center'} gap={5}>
                <Switch
                  checked={votersCustom}
                  onChange={val => {
                    setVotersCustom(val)
                  }}
                />
                <Typography variant="h6">Custom Duration</Typography>
              </Box>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Voting Duration for Proposals with Automatic Execution</span>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div className="datetime-wrapper">
                <InputNumber
                  min={0}
                  className="input-number-common"
                  value={contractData.days}
                  onChange={(_val: any) => {
                    const reg = new RegExp('^[0-9]*$')
                    if (reg.test(_val)) {
                      setContractData(
                        Object.assign({
                          ...contractData,
                          days: _val
                        })
                      )
                    }
                  }}
                />
                <span>Days</span>
              </div>
              <div className="datetime-wrapper">
                <InputNumber
                  min={0}
                  className="input-number-common"
                  value={contractData.hours}
                  max={23}
                  onChange={(_val: any) => {
                    const reg = new RegExp('^[0-9]*$')
                    if (reg.test(_val)) {
                      setContractData(
                        Object.assign({
                          ...contractData,
                          hours: _val
                        })
                      )
                    }
                  }}
                />
                <span>Hours</span>
              </div>
              <div className="datetime-wrapper">
                <InputNumber
                  min={0}
                  className="input-number-common"
                  value={contractData.minutes}
                  max={59}
                  onChange={(_val: any) => {
                    const reg = new RegExp('^[0-9]*$')
                    if (reg.test(_val)) {
                      setContractData(
                        Object.assign({
                          ...contractData,
                          minutes: _val
                        })
                      )
                    }
                  }}
                />
                <span>Minutes</span>
              </div>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Rules / Agreement</span>
            <TextArea rows={5} value={ruleContent} onChange={e => setRuleContent(e.target.value)} />
          </div>
        </Box>
      </Box>

      {!!verifyMsg && (
        <Box mt={15}>
          <AlertError>{verifyMsg}</AlertError>
        </Box>
      )}
      {account && (
        <Box mt={15}>
          <OutlineButton width={120} disabled={!updateLog.length} onClick={onUpdateConfirm}>
            Update
          </OutlineButton>
        </Box>
      )}
    </section>
  )
}
