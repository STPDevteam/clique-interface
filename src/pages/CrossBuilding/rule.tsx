import '../building/rule.pc.less'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { InputNumber, Slider, Input, Button, Switch, Tooltip } from 'antd'
import { Box, Typography } from '@mui/material'
import { CreateDaoDataRule } from 'state/building/actions'
import { toFormatGroup } from 'utils/dao'
import TextArea from 'antd/lib/input/TextArea'
import AlertError from 'components/Alert/index'
import { getAmountForPer, getPerForAmount } from '../building/function'
import BigNumber from 'bignumber.js'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useCrossBuildingDataCallback } from 'state/crossBuilding/hooks'
import { useTokenByChain } from 'state/wallet/hooks'

type CreateDaoDataRuleKey = keyof CreateDaoDataRule

export default function Rule({ goNext, goBack }: { goNext: () => void; goBack: () => void }) {
  const { updateRule, buildingDaoData } = useCrossBuildingDataCallback()
  const { basic, rule } = buildingDaoData

  const crossTokenInfo = useTokenByChain(basic.contractAddress, basic.baseChainId)
  const tokenSupply = useMemo(() => crossTokenInfo?.totalSupply?.toSignificant(), [crossTokenInfo?.totalSupply])

  // const [minVotePer, setMinVotePer] = useState(getPerForAmount(tokenSupply, rule.minVoteNumber || 1))
  const [minCreateProposalPer, setMinCreateProposalPer] = useState(0)
  const [minApprovalPer, setMinApprovalPer] = useState(0)

  useEffect(() => {
    if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
    setMinCreateProposalPer(getPerForAmount(tokenSupply, rule.minCreateProposalNumber || 1))
    setMinApprovalPer(getPerForAmount(tokenSupply, rule.minApprovalNumber || 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSupply])

  const updateRuleCall = useCallback(
    (key: CreateDaoDataRuleKey, value: any) => {
      const _updateData: CreateDaoDataRule = Object.assign({ ...rule }, { [key]: value })
      updateRule(_updateData)
    },
    [rule, updateRule]
  )

  const verifyMsg = useMemo(() => {
    if (!rule.minApprovalNumber || !rule.minCreateProposalNumber || !rule.minVoteNumber) return 'Votes required'
    if (!rule.votersCustom) {
      if (!rule.days && !rule.hours && !rule.minutes) {
        return 'Community Voting Duration required'
      }
    }
    if (!rule.contractDays && !rule.contractHours && !rule.contractMinutes) {
      return 'Contract Voting Duration required'
    }
    if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) {
      return 'loading'
    }
    if (new BigNumber(rule.minApprovalNumber).gt(tokenSupply)) {
      return 'Minimum total votes so large'
    }
    if (new BigNumber(rule.minCreateProposalNumber).gt(tokenSupply)) {
      return 'Minimum holding to create proposal so large'
    }
    if (new BigNumber(rule.minVoteNumber).gt(tokenSupply)) {
      return 'Minimum holding to vote so large'
    }
    return undefined
  }, [rule, tokenSupply])

  return (
    <>
      <section className="rule">
        <Box display="grid" gap="10px">
          <Box display={'flex'} justifyContent={'space-between'} mb={10}>
            <Typography fontSize={14} variant="h6" fontWeight={600}>
              Total Supply
            </Typography>
            <Typography fontSize={20} variant="h6" fontWeight={600}>
              {crossTokenInfo?.totalSupply?.toSignificant(6, { groupSeparator: ',' })} {crossTokenInfo?.token.symbol}
            </Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <div className="input-item progress">
              <Box className="label" display={'flex'} alignItems={'center'}>
                Minimum holding to vote
                <Tooltip
                  placement="top"
                  title="The minimum number of tokens you need to hold to vote on a proposal. You are not able to vote if your
                token holding is less than the required amount. (The default value is 1)"
                >
                  <HelpOutlineIcon sx={{ marginLeft: 5, cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              {/* <div className="progress-wrapper">
                <Slider
                  min={1}
                  max={100}
                  value={minVotePer}
                  onChange={e => {
                    setMinVotePer(e as number)
                    updateRuleCall('minVoteNumber', getAmountForPer(tokenSupply, e as number))
                  }}
                />
                <span>{Number(minVotePer.toFixed(2))}%</span>
              </div> */}
            </div>
            <div className="input-item votes">
              <Box>
                <Tooltip placement="top" title={toFormatGroup(rule.minVoteNumber, 0)}>
                  <Input
                    className="input-common"
                    value={rule.minVoteNumber}
                    onChange={e => {
                      const reg = new RegExp('^[0-9]*$')
                      const _val = e.target.value
                      if (reg.test(_val)) {
                        if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
                        // check max value
                        const input = new BigNumber(_val).gt(tokenSupply) ? tokenSupply : _val
                        updateRuleCall('minVoteNumber', input)
                        // setMinVotePer(getPerForAmount(tokenSupply, input))
                      }
                    }}
                  />
                </Tooltip>
                <span className="label"> {crossTokenInfo?.token.symbol}</span>
              </Box>
            </div>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <div className="input-item progress">
              <Box className="label" display={'flex'} alignItems={'center'}>
                Minimum holding to create proposal
                <Tooltip placement="top" title="The amount of tokens you need to stake when creating a proposal.">
                  <HelpOutlineIcon sx={{ marginLeft: 5, cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              <div className="progress-wrapper">
                <Slider
                  min={1}
                  max={100}
                  value={minCreateProposalPer}
                  onChange={e => {
                    if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
                    setMinCreateProposalPer(e as number)
                    updateRuleCall('minCreateProposalNumber', getAmountForPer(tokenSupply, e as number))
                  }}
                />
                <span>{Number(minCreateProposalPer.toFixed(2))}%</span>
              </div>
            </div>
            <div className="input-item votes">
              <span className="label">Tokens</span>
              <Box>
                <Tooltip placement="top" title={toFormatGroup(rule.minCreateProposalNumber, 0)}>
                  <Input
                    className="input-common"
                    value={rule.minCreateProposalNumber}
                    onChange={e => {
                      const reg = new RegExp('^[0-9]*$')
                      const _val = e.target.value
                      if (reg.test(_val)) {
                        if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
                        // check max value
                        const input = new BigNumber(_val).gt(tokenSupply) ? tokenSupply : _val
                        updateRuleCall('minCreateProposalNumber', input)
                        setMinCreateProposalPer(getPerForAmount(tokenSupply, input))
                      }
                    }}
                  />
                </Tooltip>
                <span className="label"> {crossTokenInfo?.token.symbol}</span>
              </Box>
            </div>
          </Box>

          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <div className="input-item progress">
              <Box className="label" display={'flex'} alignItems={'center'}>
                Minimum total votes
                <Tooltip
                  placement="top"
                  title="The minimum number of votes needed to make the result valid. By the end of the proposal, if the sum of
                votes of all options is less than the required value, the proposal will fail."
                >
                  <HelpOutlineIcon sx={{ marginLeft: 5, cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              <div className="progress-wrapper">
                <Slider
                  min={1}
                  max={100}
                  value={minApprovalPer}
                  onChange={e => {
                    if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
                    setMinApprovalPer(e as number)
                    updateRuleCall('minApprovalNumber', getAmountForPer(tokenSupply, e as number))
                  }}
                />
                <span>{Number(minApprovalPer.toFixed(2))}%</span>
              </div>
            </div>
            <div className="input-item votes">
              <span className="label">Votes</span>
              <Tooltip placement="top" title={toFormatGroup(rule.minApprovalNumber, 0)}>
                <Input
                  className="input-common w100"
                  value={rule.minApprovalNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      if (!tokenSupply || new BigNumber(tokenSupply).lt(1)) return
                      // check max value
                      const input = new BigNumber(_val).gt(tokenSupply) ? tokenSupply : _val
                      updateRuleCall('minApprovalNumber', input)
                      setMinApprovalPer(getPerForAmount(tokenSupply, input))
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
                      value={rule.days}
                      disabled={rule.votersCustom}
                      onChange={(_val: any) => {
                        const reg = new RegExp('^[0-9]*$')
                        if (reg.test(_val)) updateRuleCall('days', _val)
                      }}
                    />
                    <span>Days</span>
                  </div>
                  <div className="datetime-wrapper">
                    <InputNumber
                      min={0}
                      className="input-number-common"
                      value={rule.hours}
                      max={23}
                      disabled={rule.votersCustom}
                      onChange={(_val: any) => {
                        const reg = new RegExp('^[0-9]*$')
                        if (reg.test(_val)) updateRuleCall('hours', _val)
                      }}
                    />
                    <span>Hours</span>
                  </div>
                  <div className="datetime-wrapper">
                    <InputNumber
                      min={0}
                      className="input-number-common"
                      value={rule.minutes}
                      disabled={rule.votersCustom}
                      max={59}
                      onChange={(_val: any) => {
                        const reg = new RegExp('^[0-9]*$')
                        if (reg.test(_val)) updateRuleCall('minutes', _val)
                      }}
                    />
                    <span>Minutes</span>
                  </div>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={5}>
                  <Switch
                    checked={rule.votersCustom}
                    onChange={val => {
                      updateRuleCall('votersCustom', val)
                    }}
                  />
                  <Typography fontSize={14} variant="h6">
                    Custom Duration
                  </Typography>
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
                    value={rule.contractDays}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) updateRuleCall('contractDays', _val)
                    }}
                  />
                  <span>Days</span>
                </div>
                <div className="datetime-wrapper">
                  <InputNumber
                    min={0}
                    className="input-number-common"
                    value={rule.contractHours}
                    max={23}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) updateRuleCall('contractHours', _val)
                    }}
                  />
                  <span>Hours</span>
                </div>
                <div className="datetime-wrapper">
                  <InputNumber
                    min={0}
                    className="input-number-common"
                    value={rule.contractMinutes}
                    max={59}
                    onChange={(_val: any) => {
                      const reg = new RegExp('^[0-9]*$')
                      if (reg.test(_val)) updateRuleCall('contractMinutes', _val)
                    }}
                  />
                  <span>Minutes</span>
                </div>
              </Box>
            </div>
            {/* <div className="input-item">
          <span className="label">Rules / Agreement</span>
          <div className="drag-area">
            Drag & drop or&nbsp;<a href="browse">browse</a>
            &nbsp;files to upload.
          </div>
        </div> */}
            <div className="input-item">
              <span className="label">Rules / Agreement</span>
              <TextArea rows={5} value={rule.rules} onChange={e => updateRuleCall('rules', e.target.value)} />
            </div>
          </Box>
        </Box>

        {!!verifyMsg && (
          <Box mt={15}>
            <AlertError>{verifyMsg}</AlertError>
          </Box>
        )}
      </section>
      <Box className="btn-group" display={'flex'} justifyContent={'space-between'}>
        <Button className="btn-common btn-04" onClick={goBack}>
          Back
        </Button>
        <Button className="btn-common btn-01" onClick={goNext} disabled={!!verifyMsg}>
          Next
        </Button>
      </Box>
    </>
  )
}
