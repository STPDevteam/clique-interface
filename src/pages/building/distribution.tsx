import './config.pc.less'

import { Input, Button, Switch, Select, InputNumber, Tooltip } from 'antd'
import IconToken from '../../assets/images/icon-token.svg'
import { ReactComponent as IconAdd } from '../../assets/images/icon-upload.svg'
import { ReactComponent as IconDelete } from '../../assets/svg/icon-delete.svg'
import { privateReceivingTokens, useBuildingData } from 'state/building/hooks'
import { ZERO_ADDRESS } from '../../constants'
import { Box, Typography } from '@mui/material'
import DatePicker from 'components/DatePicker'
import TextArea from 'antd/lib/input/TextArea'
import ErrorAlert from 'components/Alert'
import IconDownArrow from 'components/ModalSTP/assets/icon-down-arrow.svg'
import { isAddress } from 'utils'
import {
  CreateDaoDataDistribution,
  CreateDaoDataDistributionPrivateSale,
  CreateDaoDataDistributionPublicSale,
  CreateDaoDataDistributionReservedToken
} from 'state/building/actions'
import { useCallback } from 'react'
import { StyledExtraBg } from 'components/styled'
import { calcTotalAmount, getAmountForPer, getPerForAmount, toFormatGroup } from 'utils/dao'

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
  price: undefined,
  pledgedOfValue: undefined
}

type CreateDaoDataDistributionKey = keyof CreateDaoDataDistribution
type CreateDaoDataDistributionReservedTokenKey = keyof CreateDaoDataDistributionReservedToken
type CreateDaoDataDistributionPrivateSaleKey = keyof CreateDaoDataDistributionPrivateSale
type CreateDaoDataDistributionPublicSaleKey = keyof CreateDaoDataDistributionPublicSale

const { Option } = Select

export default function Distribution() {
  const { updateDistribution, buildingDaoData } = useBuildingData()
  const { basic, distribution } = buildingDaoData

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
    (key: CreateDaoDataDistributionPublicSaleKey, value: string | undefined | number) => {
      const _val = Object.assign({ ...distribution.publicSale }, { [key]: value })
      updateDistributionCall('publicSale', _val)
    },
    [distribution.publicSale, updateDistributionCall]
  )

  return (
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
            <Typography fontSize={16} fontWeight={500}>
              Reserved Tokens
            </Typography>
            <Typography color={'#798488'} fontSize={12}>
              You can choose to set aside a portion of your tokens, and if you set a time lock on the address, the total
              number of tokens locked will not be counted as votes.
            </Typography>
          </Box>
          <Switch
            checked={distribution.reservedOpen}
            onChange={status => updateDistributionCall('reservedOpen', status)}
          />
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
                  <Tooltip placement="top" title={toFormatGroup(item.tokenNumber || 0, 0)}>
                    <Input
                      className="input-common token-number"
                      placeholder="1,111"
                      maxLength={basic.tokenSupply.length}
                      value={item.tokenNumber}
                      onChange={val => {
                        const reg = new RegExp('^[0-9]*$')
                        const _val = val?.toString() || ''
                        if (reg.test(_val)) {
                          updateReservedHolder(index, 'tokenNumber', _val)
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
                    maxLength={5}
                    onChange={val => {
                      let _val = val?.toString() || ''
                      if (isNaN(Number(_val))) return
                      const reg = new RegExp('^[0-9.]*$')
                      if (reg.test(_val)) {
                        if (Number(val) > 100) {
                          _val = '100'
                        }
                        updateReservedHolder(index, 'per', _val)
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
                  <StyledExtraBg width={32} height={36} svgSize={16} onClick={() => removeReservedItem(index)}>
                    <IconDelete />
                  </StyledExtraBg>
                </Box>
              ))}
            </Box>
            <Button
              className="btn-common btn-add-more"
              disabled={distribution.reservedTokens.length >= 5}
              onClick={addReservedMore}
            >
              <IconAdd />
              Add More
            </Button>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography fontSize={16} fontWeight={500}>
                Reserved amount
              </Typography>
              <Typography fontSize={16} fontWeight={500}>
                50,000,000
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
            <Typography fontSize={16} fontWeight={500}>
              Private sale
            </Typography>
            <Typography color={'#798488'} fontSize={12}>
              You can set up both whitelist crowdfunding and public crowdfunding. Whitelisted crowdfunders need to
              redeem their tokens at once. If the whitelist crowdfunding or public crowdfunding does not reach the
              specified condiftions, the cowdfunding will fail and user can redeem their toekns back by themselves.
            </Typography>
          </Box>
          <Switch
            checked={distribution.privateSaleOpen}
            onChange={status => updateDistributionCall('privateSaleOpen', status)}
          />
        </Box>
        {distribution.privateSaleOpen && (
          <Box mt={16} display={'grid'} gap={15}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography fontSize={16} fontWeight={500}>
                Receiving Tokens
              </Typography>
              <Box className="input-assets-selector" width={220}>
                <Select
                  value={distribution.privateReceivingToken}
                  suffixIcon={<img src={IconDownArrow} />}
                  onChange={val => {
                    updateDistributionCall('privateReceivingToken', val)
                  }}
                >
                  {privateReceivingTokens.map(item => (
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
                        {item.logo}
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
                  <Tooltip placement="top" title={toFormatGroup(item.tokenNumber || 0, 0)}>
                    <Input
                      className="input-common token-number"
                      placeholder="1,111"
                      maxLength={basic.tokenSupply.length}
                      value={item.tokenNumber}
                      onChange={e => {
                        const reg = new RegExp('^[0-9]*$')
                        const _val = e.target.value
                        if (!_val || reg.test(_val)) updatePrivateHolder(index, 'tokenNumber', _val)
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
                    maxLength={5}
                    onChange={val => {
                      let _val = val?.toString() || ''
                      if (isNaN(Number(_val))) return
                      const reg = new RegExp('^[0-9.]*$')
                      if (reg.test(_val)) {
                        if (Number(val) > 100) {
                          _val = '100'
                        }
                        updatePrivateHolder(index, 'per', _val)
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
                      maxLength={7}
                      value={item.price}
                      onChange={e => {
                        const _val = e.target.value
                        if (isNaN(Number(_val))) return
                        const reg = new RegExp('^[0-9.]*$')
                        if (reg.test(_val)) updatePrivateHolder(index, 'price', _val)
                      }}
                    />
                  </Tooltip>
                  <Typography fontSize={14} display={'flex'} alignItems={'center'}>
                    {toFormatGroup(calcTotalAmount(item.tokenNumber, item.price), 0)}{' '}
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
              disabled={distribution.privateSale.length >= 5}
              onClick={addPrivateSaleMore}
            >
              <IconAdd />
              Add More
            </Button>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography fontSize={16} fontWeight={500}>
                Private sale total
              </Typography>
              <Typography fontSize={16} fontWeight={500}>
                10,000,000 DCC
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography fontSize={16} fontWeight={500}>
                Equivalent estimate
              </Typography>
              <Typography fontSize={16} fontWeight={500}>
                10,000,000 DCC
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box mt={20} display={'grid'} gap={15}>
        <Box display={'flex'} justifyContent={'space-between'} gap={15}>
          <Box>
            <Typography fontSize={16} fontWeight={500}>
              Public sale
            </Typography>
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
                  <Input
                    style={{ width: 120 }}
                    className="input-common"
                    placeholder="100"
                    value={distribution.publicSale.offeringAmount}
                    onChange={e => {
                      const reg = new RegExp('^[0-9]*$')
                      const _val = e.target.value
                      if (reg.test(_val)) updatePublicSaleCall('offeringAmount', _val)
                    }}
                  />
                </Box>
                <Box display={'grid'} gap={5}>
                  <Typography color={'#798488'}>Price</Typography>
                  <Input
                    style={{ width: 104 }}
                    className="input-common"
                    placeholder="$0.2"
                    value={distribution.publicSale.price}
                    onChange={e => {
                      const _val = e.target.value
                      if (isNaN(Number(_val))) return
                      const reg = new RegExp('^[0-9.]*$')
                      if (reg.test(_val)) updatePublicSaleCall('price', _val)
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
                    value={distribution.publicSale.pledgeLimitMin}
                    onChange={e => {
                      const reg = new RegExp('^[0-9]*$')
                      const _val = e.target.value
                      if (reg.test(_val)) updatePublicSaleCall('pledgeLimitMin', _val)
                    }}
                  />
                  <Typography display={'flex'} alignItems={'center'}>
                    ----
                  </Typography>
                  <Input
                    style={{ width: 80 }}
                    className="input-common"
                    placeholder="max"
                    value={distribution.publicSale.pledgeLimitMax}
                    onChange={e => {
                      const reg = new RegExp('^[0-9]*$')
                      const _val = e.target.value
                      if (reg.test(_val)) updatePublicSaleCall('pledgeLimitMax', _val)
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography fontSize={16} fontWeight={500}>
                Public sale total
              </Typography>
              <Typography fontSize={16} fontWeight={500}>
                10,000,000 DCC
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography fontSize={16} fontWeight={500}>
                Equivalent estimate
              </Typography>
              <Typography fontSize={16} fontWeight={500}>
                10,000,000 DCC
              </Typography>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={15}>
              <Box display={'flex'} gap={24} alignItems={'center'}>
                <Typography fontSize={16} fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>
                  Start time
                </Typography>
                <DatePicker
                  valueStamp={distribution.publicSale.startTime}
                  disabledPassTime={new Date()}
                  onChange={timeStamp => {
                    updatePublicSaleCall('startTime', timeStamp)
                    updatePublicSaleCall('endTime', undefined)
                  }}
                />
              </Box>
              <Box display={'flex'} gap={24} alignItems={'center'}>
                <Typography fontSize={16} fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>
                  End time
                </Typography>
                <DatePicker
                  valueStamp={distribution.publicSale.endTime}
                  disabledPassTime={
                    distribution.publicSale.startTime ? Number(distribution.publicSale.startTime) * 1000 : new Date()
                  }
                  onChange={timeStamp => updatePublicSaleCall('endTime', timeStamp)}
                />
              </Box>
            </Box>

            <Box className="input-item">
              <Typography fontSize={16} fontWeight={500} mb={10}>
                About product
              </Typography>
              <TextArea
                rows={4}
                maxLength={200}
                value={distribution.publicSale.aboutProduct}
                onChange={e => {
                  const _val = e.target.value
                  updatePublicSaleCall('aboutProduct', _val)
                }}
              />
            </Box>
          </>
        )}
      </Box>

      <Box mt={15}>
        <ErrorAlert msg="hfkjsdhjk" />
      </Box>
    </section>
  )
}
