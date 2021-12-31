import './rule.pc.less'

import { useCallback } from 'react'
import { InputNumber, Slider, Input } from 'antd'
import { Box, Typography } from '@mui/material'
import { useBuildingData } from 'state/building/hooks'
import { CreateDaoDataRule } from 'state/building/actions'
import JSBI from 'jsbi'

type CreateDaoDataRuleKey = keyof CreateDaoDataRule

function calcVotes(total: string, perInt: number) {
  return JSBI.multiply(JSBI.BigInt(perInt), JSBI.divide(JSBI.BigInt(total), JSBI.BigInt('100'))).toString()
}

export default function Rule() {
  const { updateRule, buildingDaoData } = useBuildingData()
  const { basic, rule } = buildingDaoData

  const updateRuleCall = useCallback(
    (key: CreateDaoDataRuleKey, value: any) => {
      const _updateData: CreateDaoDataRule = Object.assign({ ...rule }, { [key]: value })
      updateRule(_updateData)
    },
    [rule, updateRule]
  )

  return (
    <section className="rule">
      <Box display="grid" gap="10px">
        <Box display={'flex'} justifyContent={'space-between'} mb={20}>
          <Typography fontSize={14} fontWeight={600}>
            Total Supply
          </Typography>
          <Typography fontSize={14} fontWeight={600}>
            {basic.tokenSupply}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum % to vote</span>
            <div className="progress-wrapper">
              <Slider min={1} max={100} value={rule.minVotePer} onChange={e => updateRuleCall('minVotePer', e)} />
              <span>{rule.minVotePer}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Input className="input-common" readOnly value={calcVotes(basic.tokenSupply, rule.minVotePer)} />
          </div>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum % create proposal</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={rule.minCreateProposalPer}
                onChange={e => updateRuleCall('minCreateProposalPer', e)}
              />
              <span>{rule.minCreateProposalPer}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Input className="input-common" readOnly value={calcVotes(basic.tokenSupply, rule.minCreateProposalPer)} />
          </div>
        </Box>

        <Box display={'flex'} justifyContent={'space-between'}>
          <div className="input-item progress">
            <span className="label">Minimum approval percentage</span>
            <div className="progress-wrapper">
              <Slider
                min={1}
                max={100}
                value={rule.minApprovalPer}
                onChange={e => updateRuleCall('minApprovalPer', e)}
              />
              <span>{rule.minApprovalPer}%</span>
            </div>
          </div>
          <div className="input-item votes">
            <span className="label">Votes</span>
            <Input className="input-common" readOnly value={calcVotes(basic.tokenSupply, rule.minApprovalPer)} />
          </div>
        </Box>

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
                value={rule.days}
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
                onChange={(_val: any) => {
                  const reg = new RegExp('^[0-9]*$')
                  if (reg.test(_val)) updateRuleCall('minutes', _val)
                }}
              />
              <span>Minutes</span>
            </div>
            {/* <div className="switch-wrapper">
              <Switch
                checked={buildingDaoData?.isCustom}
                onChange={() => {
              ({ isCustom: !buildingDaoData?.isCustom })
                }}
              />
              <span>Voters Custom</span>
            </div> */}
          </Box>
        </div>
        {/* {buildingDaoData?.isCustom && (
          <div className="input-item executor">
            <span className="label">Contract Executor</span>
            <Input placeholder="0xd97dA63d086d222EDE0aa8ee8432031465EEF" />
          </div>
        )} */}
        <div className="input-item">
          <span className="label">Rules / Agreement</span>
          <div className="drag-area">
            Drag & drop or&nbsp;<a href="browse">browse</a>
            &nbsp;files to upload.
          </div>
        </div>
      </Box>
    </section>
  )
}
