import './launching.pc.less'

import { useMemo } from 'react'
import IconToken from '../../assets/images/icon-token.svg'
import IconLaunching from '../../assets/images/icon-launching.svg'
import IconDone from '../../assets/images/icon-launched.svg'
import { Button } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { isDaoframeSite } from 'utils/dao'
import { mycliqueUrl } from '../../constants'

export default function Launching() {
  const history = useHistory()
  const { hash } = useParams<{ hash: string }>()

  const isTransactionPending = useIsTransactionPending(hash)

  const isDone = useMemo(() => {
    return !isTransactionPending
  }, [isTransactionPending])

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
            <Button
              className="btn-common btn-03"
              onClick={() => {
                if (isDaoframeSite()) {
                  window.open(mycliqueUrl)
                } else {
                  history.replace(`/`)
                }
              }}
            >
              Get started
            </Button>
          </div>
          <h3>All Done!</h3>
          <p>Your DAO has been created</p>
        </div>
      )}
    </main>
  )
}
