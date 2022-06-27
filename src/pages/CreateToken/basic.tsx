import '../building/basic.pc.less'

import { Input, Button, Select, Tooltip, InputNumber } from 'antd'
import IconUpload from '../../assets/images/icon-upload.svg'
import IUpload from '../../components/IUpload'
import { Box, Typography } from '@mui/material'
import { CreateTokenDataBasic } from 'state/createToken/actions'
import { useCallback, useMemo, useState } from 'react'
import AlertError from 'components/Alert/index'
import { useCreateTokenDataCallback } from 'state/createToken/hooks'
import IconDownArrow from 'components/ModalSTP/assets/icon-down-arrow.svg'
import { AllChainList } from 'constants/chain'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../../constants'
import { toFormatGroup } from 'utils/dao'
import BigNumber from 'bignumber.js'
import { removeEmoji } from 'utils'

const { Option } = Select
type CreateTokenDataBasicKey = keyof CreateTokenDataBasic

const supportNet = AllChainList.filter(i => SUPPORT_CREATE_TOKEN_NETWORK.includes(i.id))

export default function Basic({ goNext }: { goNext: () => void }) {
  const { createTokenData, updateBasic } = useCreateTokenDataCallback()
  const { basic: basicData } = createTokenData
  const [previewStr, setPreviewStr] = useState<any>('')

  const updateBasicCall = useCallback(
    (key: CreateTokenDataBasicKey, value: string | number) => {
      const _updateData: CreateTokenDataBasic = Object.assign({ ...basicData }, { [key]: value })
      updateBasic(_updateData)
    },
    [basicData, updateBasic]
  )

  const verifyMsg = useMemo(() => {
    if (!basicData.tokenPhoto) {
      return 'Token photo required'
    }
    if (!basicData.baseChainId) {
      return 'Blockchain required'
    }
    if (!basicData.tokenSymbol.trim()) {
      return 'Token Symbol required'
    }
    if (!basicData.tokenName.trim()) {
      return 'Token name required'
    }
    if (!new BigNumber(basicData.tokenSupply).gt(0)) {
      return 'Token Supply required'
    }
    if (basicData.tokenDecimals < 6 || basicData.tokenDecimals > 18) {
      return 'Token decimals required'
    }
    return undefined
  }, [
    basicData.baseChainId,
    basicData.tokenDecimals,
    basicData.tokenName,
    basicData.tokenPhoto,
    basicData.tokenSupply,
    basicData.tokenSymbol
  ])

  return (
    <>
      <section className="basic">
        <div>
          <div className="input-item">
            <span className="label">Token Photo *</span>
            <Box display={'flex'} alignItems={'center'} gap="5px">
              <IUpload setResult={val => updateBasicCall('tokenPhoto', val)} onPreviewStr={str => setPreviewStr(str)}>
                <Button className="btn-upload" style={{ padding: 5 }}>
                  <img
                    src={previewStr || basicData.tokenPhoto || IconUpload}
                    width={previewStr || basicData.tokenPhoto ? '100%' : 'auto'}
                    height={previewStr || basicData.tokenPhoto ? '100%' : 'auto'}
                  />
                </Button>
              </IUpload>
              <Typography>File types supported: JPG, PNG. Max size: 500KB</Typography>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Blockchain *</span>
            <Box className="input-assets-selector" width={'100%'}>
              <Select
                value={basicData.baseChainId}
                suffixIcon={<img src={IconDownArrow} />}
                onChange={e => {
                  e && updateBasicCall('baseChainId', e)
                }}
                placeholder="Please select network"
              >
                {supportNet.map(item => (
                  <Option value={item.id} key={item.id}>
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
          </div>
          <div className="input-item">
            <span className="label">Token Symbol *</span>
            <Input
              placeholder="1-16 chars"
              maxLength={16}
              value={basicData.tokenSymbol}
              onChange={e => {
                const reg = new RegExp('^[a-zA-Z]+$')
                const _val = e.target.value
                if (!_val || reg.test(_val)) updateBasicCall('tokenSymbol', _val.toUpperCase())
              }}
            />
          </div>
          <div className="input-item">
            <span className="label">Token name *</span>
            <Input
              placeholder="1-16 chars"
              maxLength={16}
              value={basicData.tokenName}
              onChange={e => {
                updateBasicCall('tokenName', removeEmoji(e.target.value))
              }}
            />
          </div>
          <Box className="input-item" display="grid !important" gridTemplateColumns="2fr 1fr" gap="20px">
            <Box display="grid">
              <span className="label">Token Supply *</span>
              <Tooltip placement="top" title={toFormatGroup(basicData.tokenSupply)}>
                <Input
                  placeholder="10000000000"
                  maxLength={16}
                  value={basicData.tokenSupply}
                  onChange={e => {
                    const reg = new RegExp('^[0-9]+$')
                    const _val = e.target.value
                    if (!_val || reg.test(_val)) updateBasicCall('tokenSupply', _val)
                    else updateBasicCall('tokenSupply', basicData.tokenSupply || '')
                  }}
                />
              </Tooltip>
              <Typography fontSize={12}>
                Changing the Token Supply will reset the number of tokens allocated subsequently
              </Typography>
            </Box>
            <Box display="grid">
              <span className="label">Token Decimals *</span>
              <InputNumber
                placeholder="18"
                className="input-number-common"
                style={{ width: '100%' }}
                min={6}
                max={18}
                value={basicData.tokenDecimals}
                onChange={val => {
                  const reg = new RegExp('^[0-9]+$')
                  if (!val || reg.test(val.toString())) updateBasicCall('tokenDecimals', val || 18)
                }}
              />
            </Box>
          </Box>
          {!!verifyMsg && (
            <Box mt={15}>
              <AlertError>{verifyMsg}</AlertError>
            </Box>
          )}
        </div>
      </section>
      <Box className="btn-group" display={'flex'} justifyContent={'center'}>
        <Button className="btn-common btn-01" onClick={goNext} disabled={!!verifyMsg}>
          Next
        </Button>
      </Box>
    </>
  )
}
