import './pc.less'

import { useMemo, useCallback } from 'react'
import { Button } from 'antd'
import IconDao from './assets/icon-dao.svg'
import IconAdd from './assets/icon-add.svg'
import { useHistory, useLocation } from 'react-router-dom'

export default function Index() {
  const location = useLocation()
  const history = useHistory()

  // useParams does not take effect on this component
  // this is an alternative plan
  const name = useMemo(() => {
    if (/^\/detail\/(\d+)$/.test(location.pathname)) {
      return RegExp.$1
    }
    return ''
  }, [location])

  const chooseDao = useCallback(
    daoName => {
      history.push(`/detail/${daoName}`)
    },
    [history]
  )

  return (
    <nav>
      {['1', '2', '3'].map((item, index) => (
        <Button key={index} className={`btn-dao ${item === name ? 'active' : ''}`} onClick={() => chooseDao(item)}>
          <img src={IconDao} />
        </Button>
      ))}
      <Button className="btn-add" onClick={() => history.push('/building')}>
        <img src={IconAdd} />
      </Button>
    </nav>
  )
}
