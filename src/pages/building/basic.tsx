import './basic.pc.less'

import { Input, Button, Tooltip, InputNumber } from 'antd'
import IconUpload from '../../assets/images/icon-upload.svg'
import IUpload from '../../components/IUpload'
import TextArea from 'antd/lib/input/TextArea'
import { Box, Typography } from '@mui/material'
import { useBuildingDataCallback } from 'state/building/hooks'
import { CreateDaoDataBasic } from 'state/building/actions'
import { useCallback, useMemo } from 'react'
import { toFormatMillion } from 'utils/dao'
import AlertError from 'components/Alert/index'
import BigNumber from 'bignumber.js'

type CreateDaoDataBasicKey = keyof CreateDaoDataBasic

export default function Basic({ goNext }: { goNext: () => void }) {
  const { buildingDaoData, updateBasic } = useBuildingDataCallback()
  const { basic: basicData } = buildingDaoData

  const updateBasicCall = useCallback(
    (key: CreateDaoDataBasicKey, value: string | number) => {
      const _updateData: CreateDaoDataBasic = Object.assign({ ...basicData }, { [key]: value })
      updateBasic(_updateData)
    },
    [basicData, updateBasic]
  )

  const verifyMsg = useMemo(() => {
    if (!basicData.daoName.trim()) {
      return 'Dao name required'
    }
    if (!basicData.tokenName.trim()) {
      return 'Token name required'
    }
    if (!basicData.tokenSymbol.trim()) {
      return 'Token symbol required'
    }
    if (!basicData.tokenSupply.trim() || !new BigNumber(basicData.tokenSupply).gt(0)) {
      return 'Token supply required'
    }
    return undefined
  }, [basicData.daoName, basicData.tokenName, basicData.tokenSupply, basicData.tokenSymbol])

  return (
    <>
      <section className="basic">
        <div>
          <div className="input-item">
            <span className="label">DAO Name</span>
            <div className="suffix-wrapper">
              <Input
                placeholder="Membership"
                maxLength={30}
                value={basicData.daoName}
                onChange={e => updateBasicCall('daoName', e.target.value)}
              />
              {/* <span className="suffix">.STPDAO</span> */}
            </div>
          </div>
          <div className="input-item">
            <span className="label">Description</span>
            <TextArea
              maxLength={200}
              value={basicData.description}
              onChange={e => updateBasicCall('description', e.target.value)}
            ></TextArea>
          </div>
          <Box className="input-item" display="grid !important" gridTemplateColumns="2fr 1fr" gap="20px">
            <Box display="grid">
              <span className="label">Token Name</span>
              <Input
                placeholder="MEMBERSHIP"
                maxLength={20}
                value={basicData.tokenName}
                onChange={e => updateBasicCall('tokenName', e.target.value)}
              />
            </Box>
            <Box display="grid">
              <span className="label">Token Symbol</span>
              <Input
                placeholder="MBR"
                maxLength={10}
                value={basicData.tokenSymbol}
                onChange={e => {
                  const reg = new RegExp('^[a-zA-Z]+$')
                  const _val = e.target.value
                  if (!_val || reg.test(_val)) updateBasicCall('tokenSymbol', _val.toUpperCase())
                }}
              />
            </Box>
          </Box>
          <Box className="input-item" display="grid !important" gridTemplateColumns="2fr 1fr" gap="20px">
            <Box display="grid">
              <span className="label">Token Supply</span>
              <Tooltip placement="top" title={toFormatMillion(basicData.tokenSupply)}>
                <Input
                  placeholder="10000000000"
                  maxLength={30}
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
              <span className="label">Token Decimals</span>
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
          <div className="input-item">
            <span className="label">Token Photo</span>
            <Box display={'flex'} alignItems={'center'} gap="5px">
              <IUpload setResult={val => updateBasicCall('tokenPhoto', val)}>
                <Button className="btn-upload">
                  <img src={IconUpload} />
                </Button>
              </IUpload>
              <Typography>File types supported: JPG, PNG. Max size: 500KB</Typography>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Website (optional)</span>
            <Input
              placeholder="http://"
              maxLength={80}
              value={basicData.websiteLink}
              onChange={e => updateBasicCall('websiteLink', e.target.value)}
            />
          </div>
          <div className="input-item">
            <span className="label">Twitter (optional)</span>
            <Input
              placeholder="@stptDAO"
              maxLength={80}
              value={basicData.twitterLink}
              onChange={e => updateBasicCall('twitterLink', e.target.value)}
            />
          </div>
          <div className="input-item">
            <span className="label">Discord (optional)</span>
            <Input
              placeholder="https://discord.gg/abc"
              maxLength={80}
              value={basicData.discordLink}
              onChange={e => updateBasicCall('discordLink', e.target.value)}
            />
          </div>
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
