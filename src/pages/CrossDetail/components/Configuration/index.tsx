import '../../../DaoDetail/components/Configuration/pc.less'

import 'react'
import { Input, Slider, Tooltip, Switch, InputNumber } from 'antd'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { toFormatGroup } from 'utils/dao'
import { getAmountForPer, getPerForAmount } from 'pages/building/function'
import BigNumber from 'bignumber.js'
import JSBI from 'jsbi'
import TextArea from 'antd/lib/input/TextArea'
import { TokenAmount } from 'constants/token'
import { calcTime } from 'utils'

// const { TextArea } = Input

export default function Configuration({
  rule,
  totalSupply,
  votingAddress
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
}) {
  // const { account } = useActiveWeb3React()
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
          <Typography variant="h6">{totalSupply.toSignificant(6, { groupSeparator: ',' })}</Typography>
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
            <Tooltip placement="top" title={toFormatGroup(minVoteNumber, 0)}>
              <Input
                readOnly
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
          </div>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <div className="input-item progress">
            <span className="label">Minimum holding to create proposal</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                disabled
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
            <span className="label">Votes</span>
            <Tooltip placement="top" title={toFormatGroup(minCreateProposalNumber)}>
              <Input
                className="input-common"
                readOnly
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
          </div>
        </Box>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <div className="input-item progress">
            <span className="label">Minimum total votes</span>
            <div className="progress-wrapper">
              <Slider
                disabled
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
                readOnly
                className="input-common"
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
            <span className="label">Community Voting Duration</span>
            <Box display={'flex'} justifyContent={'space-between'} gap={20} width={'100%'}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div className="datetime-wrapper">
                  <InputNumber
                    readOnly
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
                    readOnly
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
                    readOnly
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
                  disabled
                  checked={votersCustom}
                  onChange={val => {
                    setVotersCustom(val)
                  }}
                />
                <Typography variant="h6">Voters Custom</Typography>
              </Box>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Contract Voting Duration</span>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div className="datetime-wrapper">
                <InputNumber
                  readOnly
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
                  readOnly
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
                  readOnly
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
            <TextArea readOnly rows={5} value={ruleContent} onChange={e => setRuleContent(e.target.value)} />
          </div>
        </Box>
      </Box>

      {/* {!!verifyMsg && (
        <Box mt={15}>
          <AlertError>{verifyMsg}</AlertError>
        </Box>
      )} */}
      {/* {account && (
        <Box mt={15}>
          <OutlineButton width={120} disabled={!updateLog.length} onClick={onUpdateConfirm}>
            Update
          </OutlineButton>
        </Box>
      )} */}
    </section>
  )
}
