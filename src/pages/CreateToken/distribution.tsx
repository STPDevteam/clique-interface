import '../building/config.pc.less'

import { Input, InputNumber, Tooltip } from 'antd'
import { ReactComponent as IconAdd } from '../../assets/images/icon-upload.svg'
import { ReactComponent as IconDelete } from '../../assets/svg/icon-delete.svg'
import { useCreateTokenDataCallback, useRemainderTokenAmount } from 'state/createToken/hooks'
import { ZERO_ADDRESS } from '../../constants'
import { Box, styled, Typography } from '@mui/material'
import DatePicker from 'components/DatePicker'
import { isAddress } from 'utils'
import { CreateTokenDataDistribution } from 'state/createToken/actions'
import { useCallback, useMemo } from 'react'
import { StyledExtraBg } from 'components/styled'
import { toFormatGroup } from 'utils/dao'
import {
  getAmountForPer,
  getPerForAmount,
  getCurrentInputMaxAmount,
  getCurrentInputMaxPer,
  isValidAmount
} from '../building/function'
import BigNumber from 'bignumber.js'
import AlertError from 'components/Alert/index'
import OutlineButton from 'components/Button/OutlineButton'
import { BlackButton } from 'components/Button/Button'

const MaxTag = styled('span')({
  display: 'inline-block',
  padding: '0px 5px',
  backgroundColor: '#3898fc',
  cursor: 'pointer',
  marginLeft: 3,
  borderRadius: '2px',
  whiteSpace: 'normal'
})

const defaultReservedHolder: CreateTokenDataDistribution = {
  address: '',
  tokenNumber: undefined,
  per: undefined,
  lockDate: undefined
}

type CreateTokenDataDistributionKey = keyof CreateTokenDataDistribution

export default function Distribution({ goNext, goBack }: { goNext: () => void; goBack: () => void }) {
  const { updateDistribution, createTokenData } = useCreateTokenDataCallback()
  const { basic, distribution } = createTokenData
  const remainderTokenAmount = useRemainderTokenAmount()

  const updateReservedHolder = useCallback(
    (index: number, k: CreateTokenDataDistributionKey, v: string | number | undefined) => {
      const _holders = distribution.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [k]: v
          }
        }
        return item
      })
      updateDistribution(_holders)
    },
    [distribution, updateDistribution]
  )

  const addReservedMore = useCallback(() => {
    const _holders = [...distribution, defaultReservedHolder]
    updateDistribution(_holders)
  }, [distribution, updateDistribution])

  const removeReservedItem = useCallback(
    (index: number) => {
      const _holders = [...distribution]
      _holders.splice(index, 1)
      updateDistribution(_holders)
    },
    [distribution, updateDistribution]
  )

  const verifyMsg = useMemo(() => {
    const countRecord: { [key in string]: number } = {}
    for (const item of distribution) {
      if (!item.address) return 'Wallet address required'
      if (!isValidAmount(item.tokenNumber)) return 'Token number required'
      if (!item.lockDate) return 'Lock date required'
      if (Object.keys(countRecord).includes(item.address)) {
        countRecord[item.address] = countRecord[item.address] + 1
      } else {
        countRecord[item.address] = 1
      }
    }
    for (const i of Object.values(countRecord)) {
      if (i > 1) return 'Wallet address is repeat'
    }

    if (isValidAmount(remainderTokenAmount))
      return 'There are remaining tokens that are not used, please click Next after the configuration is complete'

    return undefined
  }, [distribution, remainderTokenAmount])

  return (
    <>
      <section className="config">
        <Box pb={15}>
          <Box mt={16} display={'grid'} gap={15}>
            <Box
              display={'grid'}
              gap={8}
              sx={{
                '&>div': {
                  gridTemplateColumns: '417fr 104fr 80fr 201fr 32fr',
                  alignItems: 'center'
                }
              }}
            >
              <Box
                display={'grid'}
                gap={10}
                sx={{
                  '& p': {
                    color: '#808191'
                  }
                }}
              >
                <Typography variant="body1">Wallet address</Typography>
                <Typography variant="body1">Token Number</Typography>
                <Typography variant="body1">% of Total</Typography>
                <Typography variant="body1">Unlock date</Typography>
              </Box>
              {distribution.map((item, index) => (
                <Box display={'grid'} gap={10} key={index}>
                  <div className="prefix-wrapper">
                    <Input
                      className="input-common"
                      placeholder={ZERO_ADDRESS}
                      maxLength={ZERO_ADDRESS.length}
                      value={item.address}
                      onChange={e => updateReservedHolder(index, 'address', e?.target?.value)}
                      onBlur={() => {
                        if (item.address && !isAddress(item.address)) updateReservedHolder(index, 'address', '')
                      }}
                    />
                  </div>
                  <Tooltip
                    placement="top"
                    title={
                      <Box textAlign={'center'}>
                        <Typography color={'#ccc'}>
                          Current tokens: {toFormatGroup(item.tokenNumber || 0, 0)}
                        </Typography>
                        <Typography color={'#ccc'}>
                          Remaining tokens: {toFormatGroup(remainderTokenAmount, 0)}
                          {!!Number(remainderTokenAmount) && (
                            <MaxTag
                              onClick={() => {
                                updateReservedHolder(
                                  index,
                                  'tokenNumber',
                                  new BigNumber(remainderTokenAmount).plus(item.tokenNumber || 0).toString()
                                )
                                const el = document.getElementById('reservedInput' + index)
                                el?.focus()
                                setTimeout(() => el?.blur())
                              }}
                            >
                              Max
                            </MaxTag>
                          )}
                        </Typography>
                      </Box>
                    }
                  >
                    <Input
                      className="input-common token-number"
                      placeholder="100"
                      maxLength={basic.tokenSupply.length}
                      id={'reservedInput' + index}
                      value={item.tokenNumber}
                      onChange={e => {
                        const reg = new RegExp('^[0-9]*$')
                        const _val = e.target.value
                        if (reg.test(_val)) {
                          // check max value
                          const input = getCurrentInputMaxAmount(remainderTokenAmount, item.tokenNumber || '', _val)
                          updateReservedHolder(index, 'tokenNumber', input)
                        } else {
                          updateReservedHolder(index, 'tokenNumber', item.tokenNumber || '')
                        }
                      }}
                      onBlur={() =>
                        updateReservedHolder(index, 'per', getPerForAmount(basic.tokenSupply, item.tokenNumber))
                      }
                    />
                  </Tooltip>

                  <InputNumber
                    className="input-number-common"
                    placeholder="100%"
                    min={0}
                    max={100}
                    value={item.per}
                    formatter={value => `${value}%`}
                    parser={value => value?.replace('%', '') || ''}
                    maxLength={6}
                    onChange={val => {
                      let _val = val?.toString() || ''
                      if (isNaN(Number(_val))) return
                      const reg = new RegExp('^[0-9.]*$')
                      if (reg.test(_val)) {
                        if (Number(val) > 100) {
                          _val = '100'
                        }
                        const maxPer = getCurrentInputMaxPer(
                          basic.tokenSupply,
                          remainderTokenAmount,
                          item.tokenNumber || '0',
                          Number(_val)
                        )
                        updateReservedHolder(index, 'per', maxPer)
                      } else {
                        updateReservedHolder(index, 'per', item.per || 0)
                      }
                    }}
                    onBlur={() =>
                      updateReservedHolder(index, 'tokenNumber', getAmountForPer(basic.tokenSupply, item.per))
                    }
                  />
                  <DatePicker
                    valueStamp={item?.lockDate}
                    disabledPassTime={new Date()}
                    onChange={timeStamp => updateReservedHolder(index, 'lockDate', timeStamp)}
                  />
                  {index > 0 && (
                    <StyledExtraBg width={32} height={36} svgSize={16} onClick={() => removeReservedItem(index)}>
                      <IconDelete />
                    </StyledExtraBg>
                  )}
                </Box>
              ))}
            </Box>
            <OutlineButton width={'250px'} disabled={distribution.length >= 100} onClick={addReservedMore}>
              <IconAdd />
              Add More
            </OutlineButton>
          </Box>
        </Box>
        {!!verifyMsg && (
          <Box mt={15}>
            <AlertError>{verifyMsg}</AlertError>
          </Box>
        )}
      </section>
      <Box className="btn-group" display={'flex'} justifyContent={'center'} gap="40px">
        <OutlineButton onClick={goBack} width="166px" height="56px">
          Back
        </OutlineButton>
        <BlackButton width="166px" height="56px" onClick={goNext} disabled={!!verifyMsg}>
          Next
        </BlackButton>
      </Box>
    </>
  )
}
