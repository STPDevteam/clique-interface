import './rule.pc.less'

import { useCallback, useMemo, useState } from 'react'
import { InputNumber, Slider, Input, Button, Switch, Tooltip } from 'antd'
import { Box, Typography } from '@mui/material'
import { useBuildingDataCallback } from 'state/building/hooks'
import { CreateDaoDataRule } from 'state/building/actions'
import { toFormatGroup } from 'utils/dao'
import TextArea from 'antd/lib/input/TextArea'
import AlertError from 'components/Alert/index'
import { ZERO_ADDRESS } from '../../constants'
import { isAddress } from 'utils'
import { getAmountForPer, getPerForAmount } from './function'
import BigNumber from 'bignumber.js'

type CreateDaoDataRuleKey = keyof CreateDaoDataRule

export default function Rule({ goNext, goBack }: { goNext: () => void; goBack: () => void }) {
  const { updateRule, buildingDaoData } = useBuildingDataCallback()
  const { basic, rule } = buildingDaoData
  const [minVotePer, setMinVotePer] = useState(getPerForAmount(basic.tokenSupply, rule.minVoteNumber || 1))
  const [minCreateProposalPer, setMinCreateProposalPer] = useState(
    getPerForAmount(basic.tokenSupply, rule.minCreateProposalNumber || 1)
  )
  const [minApprovalPer, setMinApprovalPer] = useState(getPerForAmount(basic.tokenSupply, rule.minApprovalNumber || 0))

  const updateRuleCall = useCallback(
    (key: CreateDaoDataRuleKey, value: any) => {
      const _updateData: CreateDaoDataRule = Object.assign({ ...rule }, { [key]: value })
      updateRule(_updateData)
    },
    [rule, updateRule]
  )

  const verifyMsg = useMemo(() => {
    if (!rule.minApprovalNumber || !rule.minCreateProposalNumber || !rule.minVoteNumber) return 'Votes required'
    if (rule.votersCustom) {
      if (!rule.contractExecutor) {
        return 'Contract Executor required'
      }
      if (!rule.days && !rule.hours && !rule.minutes) {
        return 'Contract Voting Duration required'
      }
    } else {
      if (!rule.days && !rule.hours && !rule.minutes) {
        return 'Community Voting Duration required'
      }
    }
    return undefined
  }, [rule])

  return (
    <>
      <section className="rule">
        <Box display="grid" gap="10px">
          <Box display={'flex'} justifyContent={'space-between'} mb={20}>
            <Typography fontSize={14} fontWeight={600}>
              Total Supply
            </Typography>
            <Typography fontSize={14} fontWeight={600}>
              {toFormatGroup(basic.tokenSupply, 0)}
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
                    updateRuleCall('minVoteNumber', getAmountForPer(basic.tokenSupply, e as number))
                  }}
                />
                <span>{Number(minVotePer.toFixed(2))}%</span>
              </div>
            </div>
            <div className="input-item votes">
              <span className="label">Votes</span>
              <Tooltip placement="top" title={toFormatGroup(rule.minVoteNumber, 0)}>
                <Input
                  className="input-common"
                  value={rule.minVoteNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      // check max value
                      const input = new BigNumber(_val).gt(basic.tokenSupply) ? basic.tokenSupply : _val
                      updateRuleCall('minVoteNumber', input)
                      setMinVotePer(getPerForAmount(basic.tokenSupply, input))
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
                    updateRuleCall('minCreateProposalNumber', getAmountForPer(basic.tokenSupply, e as number))
                  }}
                />
                <span>{Number(minCreateProposalPer.toFixed(2))}%</span>
              </div>
            </div>
            <div className="input-item votes">
              <span className="label">Votes</span>
              <Tooltip placement="top" title={toFormatGroup(rule.minCreateProposalNumber, 0)}>
                <Input
                  className="input-common"
                  value={rule.minCreateProposalNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      // check max value
                      const input = new BigNumber(_val).gt(basic.tokenSupply) ? basic.tokenSupply : _val
                      updateRuleCall('minCreateProposalNumber', input)
                      setMinCreateProposalPer(getPerForAmount(basic.tokenSupply, input))
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
                  value={minApprovalPer}
                  onChange={e => {
                    setMinApprovalPer(e as number)
                    updateRuleCall('minApprovalNumber', getAmountForPer(basic.tokenSupply, e as number))
                  }}
                />
                <span>{Number(minApprovalPer.toFixed(2))}%</span>
              </div>
            </div>
            <div className="input-item votes">
              <span className="label">Votes</span>
              <Tooltip placement="top" title={toFormatGroup(rule.minApprovalNumber, 0)}>
                <Input
                  className="input-common"
                  value={rule.minApprovalNumber}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]*$')
                    const _val = e.target.value
                    if (reg.test(_val)) {
                      // check max value
                      const input = new BigNumber(_val).gt(basic.tokenSupply) ? basic.tokenSupply : _val
                      updateRuleCall('minApprovalNumber', input)
                      setMinApprovalPer(getPerForAmount(basic.tokenSupply, input))
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
                  <Typography fontWeight={500}>Voters Custom</Typography>
                </Box>
              </Box>
            </div>
            {rule.votersCustom && (
              <>
                <div className="input-item executor">
                  <span className="label">Contract Executor</span>
                  <Input
                    placeholder={ZERO_ADDRESS}
                    maxLength={ZERO_ADDRESS.length}
                    value={rule.contractExecutor}
                    onChange={e => updateRuleCall('contractExecutor', e.target.value)}
                    onBlur={() => {
                      if (rule.contractExecutor && !isAddress(rule.contractExecutor))
                        updateRuleCall('contractExecutor', '')
                    }}
                  />
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
              </>
            )}
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
