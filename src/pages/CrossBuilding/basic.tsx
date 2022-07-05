import '../building/basic.pc.less'

import { Input, Select } from 'antd'
import IconUpload from '../../assets/images/icon-upload.svg'
import IUpload from '../../components/IUpload'
import TextArea from 'antd/lib/input/TextArea'
import { Box, Typography } from '@mui/material'
import { CrossCreateDaoDataBasic } from 'state/crossBuilding/actions'
import { useCallback, useMemo, useState } from 'react'
import AlertError from 'components/Alert/index'
import { useCrossBuildingDataCallback } from 'state/crossBuilding/hooks'
import { isAddress } from 'utils'
import IconDownArrow from 'components/ModalSTP/assets/icon-down-arrow.svg'
import { useTokenByChain } from 'state/wallet/hooks'
import { AllChainList } from 'constants/chain'
import { CROSS_SUPPORT_IMPORT_NETWORK } from '../../constants'
import { BlackButton } from 'components/Button/Button'

const { Option } = Select
type CrossCreateDaoDataBasicKey = keyof CrossCreateDaoDataBasic

const supportNet = AllChainList.filter(i => CROSS_SUPPORT_IMPORT_NETWORK.includes(i.id))

export default function Basic({ goNext }: { goNext: () => void }) {
  const { buildingDaoData, updateBasic } = useCrossBuildingDataCallback()
  const { basic: basicData } = buildingDaoData
  const [previewStr, setPreviewStr] = useState<any>('')

  const validAddress = useMemo(
    () => (basicData.contractAddress && isAddress(basicData.contractAddress) ? basicData.contractAddress : undefined),
    [basicData.contractAddress]
  )
  const crossTokenInfo = useTokenByChain(validAddress, basicData.baseChainId)

  const updateBasicCall = useCallback(
    (key: CrossCreateDaoDataBasicKey, value: string | number) => {
      const _updateData: CrossCreateDaoDataBasic = Object.assign({ ...basicData }, { [key]: value })
      updateBasic(_updateData)
    },
    [basicData, updateBasic]
  )

  const verifyMsg = useMemo(() => {
    if (!basicData.baseChainId) {
      return 'Base network required'
    }
    // if (!basicData.daoName.trim()) {
    //   return 'Dao name required'
    // }
    if (!basicData.contractAddress.trim()) {
      return 'Token contract address required'
    }
    if (!crossTokenInfo) {
      return 'Token not found'
    }
    if (!basicData.tokenPhoto) {
      return 'Token photo required'
    }
    return undefined
  }, [basicData.baseChainId, basicData.contractAddress, basicData.tokenPhoto, crossTokenInfo])

  return (
    <>
      <section className="basic">
        <div>
          <div className="input-item">
            <span className="label">Base network *</span>
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
            <span className="label">DAO Name *</span>
            <div className="suffix-wrapper">
              <Input
                placeholder="Membership"
                maxLength={30}
                value={basicData.daoName}
                onChange={e => updateBasicCall('daoName', e.target.value)}
              />
            </div>
          </div>
          <div className="input-item">
            <span className="label">Contract address *</span>
            <div className="suffix-wrapper">
              <Input
                placeholder="Token contract address"
                value={basicData.contractAddress}
                onChange={e => updateBasicCall('contractAddress', e.target.value)}
                onBlur={() => {
                  if (basicData.contractAddress && !isAddress(basicData.contractAddress))
                    updateBasicCall('contractAddress', '')
                }}
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
          <Box style={{ display: 'grid', marginBottom: '10px' }} gridTemplateColumns="1fr 1fr" className="input-item">
            <span className="label">Token name: {crossTokenInfo?.token.name || '--'}</span>
            <span className="label">Token symbol: {crossTokenInfo?.token.symbol || '--'}</span>
            <span className="label">Token Decimals: {crossTokenInfo?.token.decimals || '--'}</span>
            <span className="label">
              Token Supply: {crossTokenInfo?.totalSupply.toSignificant(6, { groupSeparator: ',' }) || '--'}
            </span>
          </Box>
          <div className="input-item">
            <span className="label">Token Photo *</span>
            <Box display={'flex'} alignItems={'center'} gap="5px">
              <IUpload setResult={val => updateBasicCall('tokenPhoto', val)} onPreviewStr={str => setPreviewStr(str)}>
                <div className="btn-upload" style={{ padding: 5, cursor: 'pointer' }}>
                  <img
                    src={previewStr || basicData.tokenPhoto || IconUpload}
                    width={previewStr || basicData.tokenPhoto ? '100%' : 'auto'}
                    height={previewStr || basicData.tokenPhoto ? '100%' : 'auto'}
                  />
                </div>
              </IUpload>
              <Typography>File types supported: JPG, PNG. Max size: 500KB</Typography>
            </Box>
          </div>
          <div className="input-item">
            <span className="label">Website URL</span>
            <Input
              placeholder="http://"
              maxLength={80}
              value={basicData.websiteLink}
              onChange={e => updateBasicCall('websiteLink', e.target.value)}
            />
          </div>
          <div className="input-item">
            <span className="label">Twitter Handle</span>
            <Input
              placeholder="@stptDAO"
              maxLength={80}
              value={basicData.twitterLink}
              onChange={e => updateBasicCall('twitterLink', e.target.value)}
            />
          </div>
          <div className="input-item">
            <span className="label">Discord server link</span>
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
        <BlackButton width="252px" height="56px" onClick={goNext} disabled={!!verifyMsg}>
          Next
        </BlackButton>
      </Box>
    </>
  )
}
