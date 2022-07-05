import './pc.less'

import { useMemo, useCallback } from 'react'
import { Button } from 'antd'
import IconDao from './assets/icon-dao.svg'
import IconAdd from './assets/icon-add.svg'
import { useHistory, useLocation } from 'react-router-dom'
import { DaoTypeProp, useCreatedDao, useGetDaoTypes, useMultiDaoBaseInfo } from 'hooks/useDAOInfo'
import Image from 'components/Image'
import { useActiveWeb3React } from 'hooks'
import { isMycliqueSite } from 'utils/dao'
import { daoframeUrl } from '../../../constants'
import { Box, Typography, useTheme } from '@mui/material'

export default function Index() {
  const location = useLocation()
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const createdAddressList = useCreatedDao(account || undefined)
  const { data: daoBaseInfoList } = useMultiDaoBaseInfo(createdAddressList || [])
  const daoTypes = useGetDaoTypes(createdAddressList)
  const theme = useTheme()

  // useParams does not take effect on this component
  // this is an alternative plan
  const activeAddress = useMemo(() => {
    if (/^\/detail\/(.*)$/.test(location.pathname)) {
      return RegExp.$1
    }
    if (/^\/external_detail\/(.*)$/.test(location.pathname)) {
      return RegExp.$1
    }
    if (/^\/cross_detail\/(.*)$/.test(location.pathname)) {
      return RegExp.$1
    }
    return ''
  }, [location])

  const chooseDao = useCallback(
    address => {
      history.push(`/detail/${address}`)
    },
    [history]
  )

  const chooseExternalDetail = useCallback(
    address => {
      history.push(`/external_detail/${address}`)
    },
    [history]
  )

  const chooseCrossDao = useCallback(
    address => {
      history.push(`/cross_detail/${address}`)
    },
    [history]
  )

  const createDao = useCallback(() => {
    if (isMycliqueSite()) {
      window.open(daoframeUrl + '#/create')
    } else {
      history.push(`/create`)
    }
  }, [history])

  return (
    <nav>
      {daoBaseInfoList.map((item, index) => (
        <Box key={index}>
          <Button
            className={`btn-dao ${item.daoAddress === activeAddress ? 'active' : ''}`}
            onClick={() => {
              if (daoTypes.loading) return
              if (daoTypes.data[index] === DaoTypeProp.ExternalDao) {
                chooseExternalDetail(item.daoAddress)
              } else if (daoTypes.data[index] === DaoTypeProp.RawDao) {
                chooseDao(item.daoAddress)
              } else {
                chooseCrossDao(item.daoAddress)
              }
            }}
          >
            <Image src={item.logo || IconDao} width={40} height={40} style={{ borderRadius: '50%' }} />
          </Button>
          <Typography
            color={theme.palette.text.secondary}
            fontSize={12}
            fontWeight={500}
            textAlign={'center'}
            textOverflow="ellipsis"
            noWrap
            mt="-20px"
          >
            {item.daoName}
          </Typography>
        </Box>
      ))}
      {!!daoBaseInfoList.length && (
        <Box height={'1px'} mt="10px" sx={{ backgroundColor: theme.palette.text.disabled }}></Box>
      )}
      <Box mb={'50px'}>
        <Button className="btn-add" onClick={createDao}>
          <img src={IconAdd} />
        </Button>
        <Typography color={theme.palette.text.secondary} fontSize={12} fontWeight={500} textAlign={'center'} mt="-20px">
          Add DAO
        </Typography>
      </Box>
    </nav>
  )
}
