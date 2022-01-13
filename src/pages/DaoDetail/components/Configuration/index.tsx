import './pc.less'

import 'react'
import { Input, Button, Slider, Tooltip, Switch, InputNumber } from 'antd'
import { Box, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import AlertError from 'components/Alert/index'
import { toFormatGroup } from 'utils/dao'
import { calcVotingDuration, getAmountForPer, getPerForAmount } from 'pages/building/function'
import { TokenAmount } from 'constants/token'
import BigNumber from 'bignumber.js'
import JSBI from 'jsbi'
import TextArea from 'antd/lib/input/TextArea'

// const { TextArea } = Input

function calcTime(timeStamp: number) {
  const days = Math.floor(timeStamp / 86400)
  const hours = Math.floor((timeStamp - days * 86400) / 3600)
  const minutes = Math.floor((timeStamp - days * 86400 - hours * 3600) / 60)
  return {
    days,
    hours,
    minutes
  }
}

export default function Configuration({
  rule,
  totalSupply
}: {
  rule: {
    minimumVote: TokenAmount
    minimumCreateProposal: TokenAmount
    minimumValidVotes: TokenAmount
    communityVotingDuration: string
    contractVotingDuration: string
    content: string
  }
  totalSupply: string
}) {
  const [minVoteNumber, setMinVoteNumber] = useState(rule.minimumVote.toSignificant())
  const [minCreateProposalNumber, setMinCreateProposalNumber] = useState(rule.minimumCreateProposal.toSignificant())
  const [minValidNumber, setMinValidNumber] = useState(rule.minimumValidVotes.toSignificant())
  const [minVotePer, setMinVotePer] = useState(getPerForAmount(totalSupply, rule.minimumVote.toSignificant()))
  const [minCreateProposalPer, setMinCreateProposalPer] = useState(
    getPerForAmount(totalSupply, rule.minimumCreateProposal.toSignificant())
  )
  const [minValidPer, setMinValidPer] = useState(getPerForAmount(totalSupply, rule.minimumValidVotes.toSignificant()))

  const [votersCustom, setVotersCustom] = useState(JSBI.GT(JSBI.BigInt(rule.communityVotingDuration), JSBI.BigInt(0)))

  const [communityData, setCommunityData] = useState(calcTime(Number(rule.communityVotingDuration)))
  const [contractData, setContractData] = useState(calcTime(Number(rule.contractVotingDuration)))

  const [content, setContent] = useState(rule.content)

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

  const onUpdate = useCallback(() => {
    const communityDuration = calcVotingDuration(
      communityData.days,
      communityData.hours,
      communityData.minutes
    ).toString()
    const contractDuration = calcVotingDuration(contractData.days, contractData.hours, contractData.minutes).toString()
    if (
      minVoteNumber === rule.minimumVote.toSignificant() &&
      minCreateProposalNumber === rule.minimumCreateProposal.toSignificant() &&
      minValidNumber === rule.minimumValidVotes.toSignificant() &&
      communityDuration === rule.communityVotingDuration &&
      contractDuration === rule.contractVotingDuration
    ) {
      return
    }
    alert('update')
  }, [
    communityData.days,
    communityData.hours,
    communityData.minutes,
    contractData.days,
    contractData.hours,
    contractData.minutes,
    minCreateProposalNumber,
    minValidNumber,
    minVoteNumber,
    rule.communityVotingDuration,
    rule.contractVotingDuration,
    rule.minimumCreateProposal,
    rule.minimumValidVotes,
    rule.minimumVote
  ])

  return (
    <section className="configuration">
      <h1>Configuration</h1>
      <Box display="grid" gap="10px">
        <Box display={'flex'} justifyContent={'space-between'} mb={20}>
          <Typography fontSize={14} fontWeight={600}>
            Total Supply
          </Typography>
          <Typography fontSize={14} fontWeight={600}>
            {toFormatGroup(totalSupply)}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum % to vote</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minVotePer}
                onChange={e => {
                  setMinVotePer(e as number)
                  setMinVoteNumber(getAmountForPer(totalSupply, e as number))
                }}
              />
              <span>{Number(minVotePer.toFixed(2))}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Tooltip placement="top" title={toFormatGroup(minVoteNumber, 0)}>
              <Input
                className="input-common"
                value={minVoteNumber}
                onChange={e => {
                  const reg = new RegExp('^[0-9]*$')
                  const _val = e.target.value
                  if (reg.test(_val)) {
                    // check max value
                    const input = new BigNumber(_val).gt(totalSupply) ? totalSupply : _val
                    setMinVoteNumber(input)
                    setMinVotePer(getPerForAmount(totalSupply, input))
                  }
                }}
              />
            </Tooltip>
          </div>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum % create proposal</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minCreateProposalPer}
                onChange={e => {
                  setMinCreateProposalPer(e as number)
                  setMinCreateProposalNumber(getAmountForPer(totalSupply, e as number))
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
                value={minCreateProposalNumber}
                onChange={e => {
                  const reg = new RegExp('^[0-9]*$')
                  const _val = e.target.value
                  if (reg.test(_val)) {
                    // check max value
                    const input = new BigNumber(_val).gt(totalSupply) ? totalSupply : _val
                    setMinCreateProposalNumber(input)
                    setMinCreateProposalPer(getPerForAmount(totalSupply, input))
                  }
                }}
              />
            </Tooltip>
          </div>
        </Box>

        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum valid votes</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={minValidPer}
                onChange={e => {
                  setMinValidPer(e as number)
                  setMinValidNumber(getAmountForPer(totalSupply, e as number))
                }}
              />
              <span>{Number(minValidPer.toFixed(2))}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Tooltip placement="top" title={toFormatGroup(minValidNumber)}>
              <Input
                className="input-common"
                value={minValidNumber}
                onChange={e => {
                  const reg = new RegExp('^[0-9]*$')
                  const _val = e.target.value
                  if (reg.test(_val)) {
                    // check max value
                    const input = new BigNumber(_val).gt(totalSupply) ? totalSupply : _val
                    setMinValidNumber(input)
                    setMinValidPer(getPerForAmount(totalSupply, input))
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
                            hours: _val
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
                <Typography fontWeight={500}>Voters Custom</Typography>
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
            <TextArea rows={5} value={content} onChange={e => setContent(e.target.value)} />
          </div>
        </Box>
      </Box>

      {!!verifyMsg && (
        <Box mt={15}>
          <AlertError>{verifyMsg}</AlertError>
        </Box>
      )}
      <Button className="btn-common btn-02 btn-update pc-mt-25" onClick={onUpdate}>
        Update
      </Button>
    </section>
  )
}
