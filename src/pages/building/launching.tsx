import './launching.pc.less'

import { useMemo, useState, useEffect } from 'react'
import IconToken from '../../assets/images/icon-token.svg'
import IconLaunching from '../../assets/images/icon-launching.svg'
import IconDone from '../../assets/images/icon-launched.svg'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'

type State = 'launching' | 'done'

const Launching = () => {
  const [state, setState] = useState<State>('launching')
  const history = useHistory()

  const isDone = useMemo(() => state === ('done' as State), [state])

  // Mock
  useEffect(() => {
    setTimeout(() => {
      setState('done')
    }, 2000)
  }, [])

  return (
    <main className="launching">
      {!isDone && (
        <div className="state-launching">
          <div className="wrapper">
            <img className="outer" src={IconLaunching} />
            <img className="inner" src={IconToken} />
          </div>
          <p>Launching Your DAO...</p>
        </div>
      )}
      {isDone && (
        <div className="state-done">
          <div className="wrapper">
            <img src={IconDone} />
            <Button className="btn-common btn-03" onClick={() => history.push(`/detail/1`)}>
              Get Start
            </Button>
          </div>
          <h3>All Done!</h3>
          <p>Your organization is ready</p>
        </div>
      )}
    </main>
  )
}

export default Launching
