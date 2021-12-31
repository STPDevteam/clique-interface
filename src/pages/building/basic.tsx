import './basic.pc.less'

import { Input, Button } from 'antd'
import IconUpload from '../../assets/images/icon-upload.svg'
import IUpload from '../../components/IUpload'
import TextArea from 'antd/lib/input/TextArea'
import { Box, Typography } from '@mui/material'
import { useBuildingData } from 'state/building/hooks'
import { CreateDaoDataBasic } from 'state/building/actions'
import { useCallback } from 'react'
import { toFormatMillion } from 'utils/dao'

type CreateDaoDataBasicKey = keyof CreateDaoDataBasic

export default function Basic() {
  const { buildingDaoData, updateBasic } = useBuildingData()
  const { basic: basicData } = buildingDaoData

  const updateBasicCall = useCallback(
    (key: CreateDaoDataBasicKey, value: any) => {
      const _updateData: CreateDaoDataBasic = Object.assign({ ...basicData }, { [key]: value })
      updateBasic(_updateData)
    },
    [basicData, updateBasic]
  )

  return (
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
        <div className="input-item">
          <span className="label">Token Supply</span>
          <Input
            placeholder="100,0000,0000"
            maxLength={30}
            value={basicData.tokenSupply}
            onChange={e => {
              const reg = new RegExp('[0-9]+$')
              const _val = e.target.value
              if (!_val || reg.test(_val)) updateBasicCall('tokenSupply', _val)
            }}
          />
          <Typography>{toFormatMillion(basicData.tokenSupply)}</Typography>
        </div>
        <div className="input-item">
          <span className="label">Token Photo</span>
          <IUpload>
            <Button className="btn-upload">
              <img src={IconUpload} />
            </Button>
          </IUpload>
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
      </div>
    </section>
  )
}
