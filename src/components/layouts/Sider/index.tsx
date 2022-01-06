import './pc.less'

import { useMemo, useCallback } from 'react'
import { Button } from 'antd'
import IconDao from './assets/icon-dao.svg'
import IconAdd from './assets/icon-add.svg'
import { useHistory, useLocation } from 'react-router-dom'
import { useCreatedDao, useMultiDaoBaseInfo } from 'hooks/useDAOInfo'
import Image from 'components/Image'

export default function Index() {
  const location = useLocation()
  const history = useHistory()
  const createdAddressList = useCreatedDao()
  const daoBaseInfoList = useMultiDaoBaseInfo(createdAddressList || [])

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

  return (
    <nav>
      {daoBaseInfoList.map((item, index) => (
        <Button
          key={index}
          className={`btn-dao ${item.daoAddress === activeAddress ? 'active' : ''}`}
          onClick={() => chooseDao(item.daoAddress)}
        >
          <Image src={item.token?.logo || IconDao} width={80} height={80} />
        </Button>
      ))}
      <Button className="btn-add" onClick={() => history.push('/create')}>
        <img src={IconAdd} />
      </Button>
    </nav>
  )
}
