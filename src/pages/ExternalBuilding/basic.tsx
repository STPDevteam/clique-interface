import '../building/basic.pc.less'

import { Input, Button } from 'antd'
import IconUpload from '../../assets/images/icon-upload.svg'
import IUpload from '../../components/IUpload'
import TextArea from 'antd/lib/input/TextArea'
import { Box, Typography } from '@mui/material'
import { ExternalCreateDaoDataBasic } from 'state/externalBuilding/actions'
import { useCallback, useMemo, useState } from 'react'
import AlertError from 'components/Alert/index'
import { useExternalBuildingDataCallback } from 'state/externalBuilding/hooks'
import { useExternalTokenInfo } from 'hooks/external/useExternalTokenInfo'
import { isAddress } from 'utils'

type ExternalCreateDaoDataBasicKey = keyof ExternalCreateDaoDataBasic

export default function Basic({ goNext }: { goNext: () => void }) {
  const { buildingDaoData, updateBasic } = useExternalBuildingDataCallback()
  const { basic: basicData } = buildingDaoData
  const [previewStr, setPreviewStr] = useState<any>('')

  const validAddress = useMemo(
    () => (basicData.contractAddress && isAddress(basicData.contractAddress) ? basicData.contractAddress : undefined),
    [basicData.contractAddress]
  )
  const externalTokenInfo = useExternalTokenInfo(validAddress)

  const updateBasicCall = useCallback(
    (key: ExternalCreateDaoDataBasicKey, value: string | number) => {
      const _updateData: ExternalCreateDaoDataBasic = Object.assign({ ...basicData }, { [key]: value })
      updateBasic(_updateData)
    },
    [basicData, updateBasic]
  )

  const verifyMsg = useMemo(() => {
    if (!basicData.daoName.trim()) {
      return 'DAO name required'
    }
    if (!basicData.tokenPhoto) {
      return 'Token photo required'
    }
    if (!basicData.contractAddress.trim()) {
      return 'Contract address required'
    }
    if (!externalTokenInfo.isSupportShot) {
      return 'The token contract snapshots are not supported'
    }
    return undefined
  }, [basicData.contractAddress, basicData.daoName, basicData.tokenPhoto, externalTokenInfo.isSupportShot])

  return (
    <>
      <section className="basic">
        <div>
          <div className="input-item">
            <span className="label">DAO Name *</span>
            <div className="suffix-wrapper">
              <Input
                placeholder="DAO name"
                maxLength={30}
                value={basicData.daoName}
                onChange={e => updateBasicCall('daoName', e.target.value)}
              />
              {/* <span className="suffix">.STPDAO</span> */}
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
            <span className="label">Token name: {externalTokenInfo.token?.name || '--'}</span>
            <span className="label">Token symbol: {externalTokenInfo.token?.symbol || '--'}</span>
            <span className="label">Token Decimals: {externalTokenInfo.token?.decimals || '--'}</span>
            <span className="label">
              Token Supply: {externalTokenInfo.totalSupply?.toSignificant(6, { groupSeparator: ',' }) || '--'}
            </span>
          </Box>
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
        <Button className="btn-common btn-01" onClick={goNext} disabled={!!verifyMsg}>
          Next
        </Button>
      </Box>
    </>
  )
}
