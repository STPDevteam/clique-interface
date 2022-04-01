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

export default function Index() {
  const location = useLocation()
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const createdAddressList = useCreatedDao(account || undefined)
  const { data: daoBaseInfoList } = useMultiDaoBaseInfo(createdAddressList || [])
  const daoTypes = useGetDaoTypes(createdAddressList)

  // useParams does not take effect on this component
  // this is an alternative plan
  const activeAddress = useMemo(() => {
    if (/^\/detail\/(.*)$/.test(location.pathname)) {
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
        <Button
          key={index}
          className={`btn-dao ${item.daoAddress === activeAddress ? 'active' : ''}`}
          onClick={() => {
            if (daoTypes.loading) return
            if (daoTypes.data[index] === DaoTypeProp.ExternalDao) {
              chooseExternalDetail(item.daoAddress)
            } else if (daoTypes.data[index] === DaoTypeProp.RawDao) {
              chooseDao(item.daoAddress)
            }
          }}
        >
          <Image src={item.logo || IconDao} width={48} height={48} style={{ borderRadius: '50%' }} />
        </Button>
      ))}
      <Button className="btn-add" onClick={createDao}>
        <img src={IconAdd} />
      </Button>
    </nav>
  )
}
