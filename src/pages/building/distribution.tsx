import './config.pc.less'

import { Input, Button, Switch, Select, InputNumber, Tooltip } from 'antd'
import IconToken from '../../assets/images/icon-token.svg'
import { ReactComponent as IconAdd } from '../../assets/images/icon-upload.svg'
import { ReactComponent as IconDelete } from '../../assets/svg/icon-delete.svg'
import {
  useBuildingDataCallback,
  useCurPrivateReceivingTokens,
  useCurrentUsedTokenAmount,
  useRemainderTokenAmount
} from 'state/building/hooks'
import { ZERO_ADDRESS } from '../../constants'
import { Box, styled, Typography } from '@mui/material'
import DatePicker from 'components/DatePicker'
import TextArea from 'antd/lib/input/TextArea'
import IconDownArrow from 'components/ModalSTP/assets/icon-down-arrow.svg'
import { isAddress } from 'utils'
import {
  CreateDaoDataDistribution,
  CreateDaoDataDistributionPrivateSale,
  CreateDaoDataDistributionPublicSale,
  CreateDaoDataDistributionReservedToken
} from 'state/building/actions'
import { useCallback, useMemo } from 'react'
import { StyledExtraBg } from 'components/styled'
import { toFormatGroup } from 'utils/dao'
import {
  calcTotalAmountValue,
  getAmountForPer,
  getPerForAmount,
  getCurrentInputMaxAmount,
  getCurrentInputMaxPer,
  isValidAmount
} from './function'
import BigNumber from 'bignumber.js'
import AlertError from 'components/Alert/index'

const MaxTag = styled('span')({
  display: 'inline-block',
  padding: '0px 5px',
  backgroundColor: '#3898fc',
  cursor: 'pointer',
  marginLeft: 3,
  borderRadius: '2px',
  whiteSpace: 'normal'
})

const defaultReservedHolder: CreateDaoDataDistributionReservedToken = {
  address: '',
  tokenNumber: undefined,
  per: undefined,
  lockdate: undefined
}

const defaultPrivateHolder: CreateDaoDataDistributionPrivateSale = {
  address: '',
  tokenNumber: undefined,
  per: undefined,
  price: undefined
}

type CreateDaoDataDistributionKey = keyof CreateDaoDataDistribution
type CreateDaoDataDistributionReservedTokenKey = keyof CreateDaoDataDistributionReservedToken
type CreateDaoDataDistributionPrivateSaleKey = keyof CreateDaoDataDistributionPrivateSale
type CreateDaoDataDistributionPublicSaleKey = keyof CreateDaoDataDistributionPublicSale

const { Option } = Select

export default function Distribution({ goNext, goBack }: { goNext: () => void; goBack: () => void }) {
  const { updateDistribution, buildingDaoData } = useBuildingDataCallback()
  const { basic, distribution } = buildingDaoData
  const currentUsedTokenAmount = useCurrentUsedTokenAmount()
  const remainderTokenAmount = useRemainderTokenAmount()
  const curPrivateReceivingTokens = useCurPrivateReceivingTokens()

  const updateDistributionCall = useCallback(
    (key: CreateDaoDataDistributionKey, value: any) => {
      const _updateData: CreateDaoDataDistribution = Object.assign({ ...distribution }, { [key]: value })
      updateDistribution(_updateData)
    },
    [distribution, updateDistribution]
  )

  const updateReservedHolder = useCallback(
    (index: number, k: CreateDaoDataDistributionReservedTokenKey, v: string | number | undefined) => {
      const _holders = distribution.reservedTokens.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [k]: v
          }
        }
        return item
      })
      updateDistributionCall('reservedTokens', _holders)
    },
    [distribution.reservedTokens, updateDistributionCall]
  )

  const addReservedMore = useCallback(() => {
    const _holders = [...distribution.reservedTokens, defaultReservedHolder]
    updateDistributionCall('reservedTokens', _holders)
  }, [distribution.reservedTokens, updateDistributionCall])

  const removeReservedItem = useCallback(
    (index: number) => {
      const _holders = [...distribution.reservedTokens]
      _holders.splice(index, 1)
      updateDistributionCall('reservedTokens', _holders)
    },
    [distribution.reservedTokens, updateDistributionCall]
  )

  const updatePrivateHolder = useCallback(
    (index: number, k: CreateDaoDataDistributionPrivateSaleKey, v: string | number | undefined) => {
      const _holders = distribution.privateSale.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [k]: v
          }
        }
        return item
      })
      updateDistributionCall('privateSale', _holders)
    },
    [distribution.privateSale, updateDistributionCall]
  )

  const addPrivateSaleMore = useCallback(() => {
    const _holders = [...distribution.privateSale, defaultPrivateHolder]
    updateDistributionCall('privateSale', _holders)
  }, [distribution.privateSale, updateDistributionCall])

  const removePrivateSaleItem = useCallback(
    (index: number) => {
      const _holders = [...distribution.privateSale]
      _holders.splice(index, 1)
      updateDistributionCall('privateSale', _holders)
    },
    [distribution.privateSale, updateDistributionCall]
  )

  const updatePublicSaleCall = useCallback(
    (key: CreateDaoDataDistributionPublicSaleKey, value: any) => {
      const _val = Object.assign({ ...distribution.publicSale }, { [key]: value })
      updateDistributionCall('publicSale', _val)
    },
    [distribution.publicSale, updateDistributionCall]
  )

  const verifyMsg = useMemo(() => {
    if (distribution.reservedOpen) {
      for (const item of distribution.reservedTokens) {
        if (!item.address) return 'Reserved tokens address required'
        if (!isValidAmount(item.tokenNumber)) return 'Reserved tokens number required'
        if (!item.lockdate) return 'Reserved tokens lock date required'
      }
    }
    if (distribution.privateSaleOpen) {
      for (const item of distribution.privateSale) {
        if (!item.address) return 'Private sale tokens address required'
        if (!isValidAmount(item.tokenNumber)) return 'Private sale tokens number required'
        if (!Number(item.price)) return 'Private sale tokens price required'
      }
    }
    if (distribution.publicSaleOpen) {
      const _publicSaleData = distribution.publicSale
      if (!isValidAmount(_publicSaleData.offeringAmount)) return 'Public sale offering amount required'
      if (!Number(_publicSaleData.price)) return 'Public sale price required'
      // if (!isValidAmount(_publicSaleData.pledgeLimitMin) || !isValidAmount(_publicSaleData.pledgeLimitMax))
      //   return 'Public sale pledge limit required'
    }
    if (distribution.publicSaleOpen || distribution.privateSaleOpen) {
      const isValidPrivateReceivingToken = curPrivateReceivingTokens.filter(
        item => item.value === distribution.privateReceivingToken
      )
      if (!isValidPrivateReceivingToken.length) {
        return 'Receiving token invalid'
      }
    }

    if (!distribution.startTime) return 'Start time required'
    if (!distribution.endTime) return 'End time required'

    if (Number(distribution.startTime >= Number(distribution.endTime))) return 'Start time must be less than end time'

    if (isValidAmount(remainderTokenAmount)) return '有剩余代币未被使用，请配置完成后点击下一步'

    return undefined
  }, [
    curPrivateReceivingTokens,
    distribution.endTime,
    distribution.privateReceivingToken,
    distribution.privateSale,
    distribution.privateSaleOpen,
    distribution.publicSale,
    distribution.publicSaleOpen,
    distribution.reservedOpen,
    distribution.reservedTokens,
    distribution.startTime,
    remainderTokenAmount
  ])

  return (
    <>
      <section className="config">
        <div className="summary">
          <img src={basic.tokenPhoto || IconToken} />
          <div className="name">
            <span>{basic.daoName}</span>
            <span>{basic.tokenName}</span>
          </div>
          <div className="supply">
            <span>Total Supply</span>
            <span>{toFormatGroup(basic.tokenSupply, 0)}</span>
          </div>
        </div>

        <Box
          mt={20}
          sx={{
            paddingBottom: 15,
            borderBottom: '1px solid #D2D2D2'
          }}
        >
          <Box display={'flex'} justifyContent={'space-between'} gap={15}>
            <Box>
              <Typography variant="h6">Reserved Tokens</Typography>
              <Typography color={'#798488'} fontSize={12}>
                You can choose to set aside a portion of your tokens, and if you set a time lock on the address, the
                total number of tokens locked will not be counted as votes.
              </Typography>
            </Box>
            {/* <Switch
              checked={distribution.reservedOpen}
              onChange={status => updateDistributionCall('reservedOpen', status)}
            /> */}
          </Box>
          {distribution.reservedOpen && (
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
                      color: '#798488'
                    }
                  }}
                >
                  <Typography variant="body1">Addresses</Typography>
                  <Typography variant="body1">Token Number</Typography>
                  <Typography variant="body1">Per</Typography>
                  <Typography variant="body1">Lock date</Typography>
                </Box>
                {distribution.reservedTokens.map((item, index) => (
                  <Box display={'grid'} gap={10} key={index}>
                    <div className="prefix-wrapper">
                      <img src={IconToken} />
                      <Input
                        className="input-common"
                        style={{ paddingLeft: 50 }}
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
                            const input = getCurrentInputMaxAmount(remainderTokenAmount, item.tokenNumber || '0', _val)
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
                      valueStamp={item?.lockdate}
                      disabledPassTime={new Date()}
                      onChange={timeStamp => updateReservedHolder(index, 'lockdate', timeStamp)}
                    />
                    {index > 0 && (
                      <StyledExtraBg width={32} height={36} svgSize={16} onClick={() => removeReservedItem(index)}>
                        <IconDelete />
                      </StyledExtraBg>
                    )}
                  </Box>
                ))}
              </Box>
              <Button
                className="btn-common btn-add-more"
                disabled={distribution.reservedTokens.length >= 20}
                onClick={addReservedMore}
              >
                <IconAdd />
                Add More
              </Button>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6">Reserved amount</Typography>
                <Typography variant="h6">
                  {toFormatGroup(currentUsedTokenAmount.reservedAmount, 0)} {basic.tokenSymbol}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          mt={20}
          sx={{
            paddingBottom: 15,
            borderBottom: '1px solid #D2D2D2'
          }}
        >
          <Box display={'flex'} justifyContent={'space-between'} gap={15}>
            <Box>
              <Typography variant="h6">Whitelist sale</Typography>
              <Typography color={'#798488'} fontSize={12}>
                You can set up both whitelist crowdfunding and public crowdfunding. Whitelisted crowdfunders need to
                redeem their tokens at once. If the whitelist crowdfunding or public crowdfunding does not reach the
                specified condiftions, the cowdfunding will fail and user can redeem their toekns back by themselves.
              </Typography>
            </Box>
            <Switch
              checked={distribution.privateSaleOpen}
              onChange={status => {
                updateDistributionCall('privateSaleOpen', status)
                if (status && distribution.privateSale.length === 0) {
                  addPrivateSaleMore()
                }
              }}
            />
          </Box>
          {distribution.privateSaleOpen && (
            <Box mt={16} display={'grid'} gap={15}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h6">Receiving Tokens</Typography>
                <Box className="input-assets-selector" width={220}>
                  <Select
                    value={distribution.privateReceivingToken}
                    suffixIcon={<img src={IconDownArrow} />}
                    onChange={val => {
                      updateDistributionCall('privateReceivingToken', val)
                    }}
                  >
                    {curPrivateReceivingTokens.map(item => (
                      <Option value={item.value} key={item.value}>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          gap={5}
                          sx={{
                            '& img, & svg': {
                              width: 20,
                              height: 20
                            }
                          }}
                        >
                          <img src={item.logo} />
                          {item.name}
                        </Box>
                      </Option>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box
                display={'grid'}
                gap={8}
                sx={{
                  '&>div': {
                    gridTemplateColumns: '417fr 104fr 80fr 80fr 110fr 32fr',
                    alignItems: 'center'
                  }
                }}
              >
                <Box
                  display={'grid'}
                  gap={10}
                  sx={{
                    '& p': {
                      color: '#798488'
                    }
                  }}
                >
                  <Typography variant="body1">Addresses</Typography>
                  <Typography variant="body1">Token Number</Typography>
                  <Typography variant="body1">Per</Typography>
                  <Typography variant="body1">Price</Typography>
                  <Typography variant="body1">Pledged of value</Typography>
                </Box>
                {distribution.privateSale.map((item, index) => (
                  <Box display={'grid'} gap={10} key={index}>
                    <div className="prefix-wrapper">
                      <img src={IconToken} />
                      <Input
                        className="input-common"
                        style={{ paddingLeft: 50 }}
                        placeholder={ZERO_ADDRESS}
                        maxLength={ZERO_ADDRESS.length}
                        value={item.address}
                        onChange={e => updatePrivateHolder(index, 'address', e?.target?.value)}
                        onBlur={() => {
                          if (item.address && !isAddress(item.address)) updatePrivateHolder(index, 'address', '')
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
                                  updatePrivateHolder(
                                    index,
                                    'tokenNumber',
                                    new BigNumber(remainderTokenAmount).plus(item.tokenNumber || 0).toString()
                                  )
                                  const el = document.getElementById('privateInput' + index)
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
                        value={item.tokenNumber}
                        id={'privateInput' + index}
                        onChange={e => {
                          const reg = new RegExp('^[0-9]*$')
                          const _val = e.target.value
                          if (reg.test(_val)) {
                            const input = getCurrentInputMaxAmount(remainderTokenAmount, item.tokenNumber || '0', _val)
                            updatePrivateHolder(index, 'tokenNumber', input)
                          } else {
                            updatePrivateHolder(index, 'tokenNumber', item.tokenNumber || '')
                          }
                        }}
                        onBlur={() =>
                          updatePrivateHolder(index, 'per', getPerForAmount(basic.tokenSupply, item.tokenNumber))
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
                          updatePrivateHolder(index, 'per', maxPer)
                        } else {
                          updatePrivateHolder(index, 'per', item.per || 0)
                        }
                      }}
                      onBlur={() =>
                        updatePrivateHolder(index, 'tokenNumber', getAmountForPer(basic.tokenSupply, item.per))
                      }
                    />
                    <Tooltip placement="top" title={`${item.price || '0'} ${distribution.privateReceivingToken}/token`}>
                      <Input
                        className="input-common"
                        placeholder="1.00"
                        maxLength={8}
                        value={item.price}
                        onChange={e => {
                          const _val = e.target.value
                          if (isNaN(Number(_val))) {
                            updatePrivateHolder(index, 'price', item.price || 0)
                            return
                          }
                          const reg = new RegExp('^[0-9.]*$')
                          if (reg.test(_val)) updatePrivateHolder(index, 'price', _val)
                          else {
                            updatePrivateHolder(index, 'price', item.price || 0)
                          }
                        }}
                      />
                    </Tooltip>
                    <Typography fontSize={14} fontWeight={500} display={'flex'} alignItems={'center'}>
                      {toFormatGroup(calcTotalAmountValue(item.tokenNumber, item.price), 0)}{' '}
                      {distribution.privateReceivingToken}
                    </Typography>
                    <StyledExtraBg width={32} height={36} svgSize={16} onClick={() => removePrivateSaleItem(index)}>
                      <IconDelete />
                    </StyledExtraBg>
                  </Box>
                ))}
              </Box>
              <Button
                className="btn-common btn-add-more"
                disabled={distribution.privateSale.length >= 20}
                onClick={addPrivateSaleMore}
              >
                <IconAdd />
                Add More
              </Button>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6">Private sale total</Typography>
                <Typography variant="h6">
                  {toFormatGroup(currentUsedTokenAmount.privateSaleTotal, 0)} {basic.tokenSymbol}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6">Equivalent estimate</Typography>
                <Typography variant="h6">
                  {toFormatGroup(currentUsedTokenAmount.privateEquivalentEstimate, 0)}{' '}
                  {distribution.privateReceivingToken}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          mt={20}
          display={'grid'}
          gap={15}
          sx={{
            paddingBottom: 15,
            borderBottom: '1px solid #D2D2D2'
          }}
        >
          <Box display={'flex'} justifyContent={'space-between'} gap={15}>
            <Box>
              <Typography variant="h6">Public sale</Typography>
            </Box>
            <Switch
              checked={distribution.publicSaleOpen}
              onChange={status => updateDistributionCall('publicSaleOpen', status)}
            />
          </Box>
          {distribution.publicSaleOpen && (
            <>
              <Box display={'flex'} justifyContent={'space-between'} gap={15} mt={5}>
                <Box display={'flex'} gap={25}>
                  <Box display={'grid'} gap={5}>
                    <Typography color={'#798488'}>Offering Amount</Typography>
                    <Tooltip
                      placement="top"
                      title={
                        <Box textAlign={'center'}>
                          <Typography color={'#ccc'}>
                            Current tokens: {toFormatGroup(distribution.publicSale.offeringAmount || 0, 0)}
                          </Typography>
                          <Typography color={'#ccc'}>
                            Remaining tokens: {toFormatGroup(remainderTokenAmount, 0)}
                            {!!Number(remainderTokenAmount) && (
                              <MaxTag
                                onClick={() =>
                                  updatePublicSaleCall(
                                    'offeringAmount',
                                    new BigNumber(remainderTokenAmount)
                                      .plus(distribution.publicSale.offeringAmount || 0)
                                      .toString()
                                  )
                                }
                              >
                                Max
                              </MaxTag>
                            )}
                          </Typography>
                        </Box>
                      }
                    >
                      <Input
                        style={{ width: 120 }}
                        className="input-common"
                        placeholder="100"
                        maxLength={basic.tokenSupply.length}
                        value={distribution.publicSale.offeringAmount}
                        onChange={e => {
                          const reg = new RegExp('^[0-9]*$')
                          const _val = e.target.value
                          if (reg.test(_val)) {
                            const input = getCurrentInputMaxAmount(
                              remainderTokenAmount,
                              distribution.publicSale.offeringAmount || '0',
                              _val
                            )
                            updatePublicSaleCall('offeringAmount', input)
                          } else {
                            updatePublicSaleCall('offeringAmount', distribution.publicSale.offeringAmount || '')
                          }
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Box display={'grid'} gap={5}>
                    <Typography color={'#798488'}>Price</Typography>
                    <Input
                      style={{ width: 130 }}
                      className="input-common"
                      placeholder="1.00"
                      maxLength={8}
                      value={distribution.publicSale.price}
                      suffix={distribution.privateReceivingToken}
                      onChange={e => {
                        const _val = e.target.value
                        if (isNaN(Number(_val))) {
                          updatePublicSaleCall('price', distribution.publicSale.price || 0)
                          return
                        }
                        const reg = new RegExp('^[0-9.]*$')
                        if (reg.test(_val)) updatePublicSaleCall('price', _val)
                        else updatePublicSaleCall('price', distribution.publicSale.price || 0)
                      }}
                    />
                  </Box>
                </Box>
                <Box display={'grid'} gap={5}>
                  <Typography color={'#798488'}>Pledge limit (optional)</Typography>
                  <Box display={'flex'} gap={8}>
                    <Input
                      style={{ width: 80 }}
                      className="input-common"
                      placeholder="min"
                      maxLength={basic.tokenSupply.length}
                      value={distribution.publicSale.pledgeLimitMin}
                      onChange={e => {
                        const reg = new RegExp('^[0-9]*$')
                        const _val = e.target.value
                        if (reg.test(_val)) updatePublicSaleCall('pledgeLimitMin', _val)
                        else updatePublicSaleCall('pledgeLimitMin', distribution.publicSale.pledgeLimitMin || '')
                      }}
                    />
                    <Typography display={'flex'} alignItems={'center'}>
                      ----
                    </Typography>
                    <Input
                      style={{ width: 80 }}
                      className="input-common"
                      placeholder="max"
                      maxLength={basic.tokenSupply.length}
                      value={distribution.publicSale.pledgeLimitMax}
                      onChange={e => {
                        const reg = new RegExp('^[0-9]*$')
                        const _val = e.target.value
                        if (reg.test(_val)) updatePublicSaleCall('pledgeLimitMax', _val)
                        else updatePublicSaleCall('pledgeLimitMax', distribution.publicSale.pledgeLimitMax || '')
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6">Public sale total</Typography>
                <Typography variant="h6">
                  {toFormatGroup(currentUsedTokenAmount.publicSaleTotal, 0)} {basic.tokenSymbol}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h6">Equivalent estimate</Typography>
                <Typography variant="h6">
                  {toFormatGroup(currentUsedTokenAmount.publicEquivalentEstimate, 0)}{' '}
                  {distribution.privateReceivingToken}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box mt={20} display={'grid'} gap={15}>
          <Box display={'flex'} justifyContent={'space-between'} gap={15}>
            <Box display={'flex'} gap={24} alignItems={'center'}>
              <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
                Start time
              </Typography>
              <DatePicker
                valueStamp={distribution.startTime}
                disabledPassTime={new Date()}
                onChange={timeStamp => {
                  updateDistributionCall('startTime', timeStamp)
                }}
              />
            </Box>
            <Box display={'flex'} gap={24} alignItems={'center'}>
              <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
                End time
              </Typography>
              <DatePicker
                valueStamp={distribution.endTime}
                disabledPassTime={distribution.startTime ? Number(distribution.startTime) * 1000 : new Date()}
                onChange={timeStamp => updateDistributionCall('endTime', timeStamp)}
              />
            </Box>
          </Box>

          <Box className="input-item">
            <Typography variant="h6" mb={10}>
              About product
            </Typography>
            <TextArea
              rows={4}
              maxLength={200}
              value={distribution.aboutProduct}
              onChange={e => {
                const _val = e.target.value
                updateDistributionCall('aboutProduct', _val)
              }}
            />
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
