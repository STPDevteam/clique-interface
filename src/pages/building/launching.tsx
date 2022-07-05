import './launching.pc.less'

import { useMemo } from 'react'
import IconLaunching from '../../assets/images/icon-launching.svg'
import IconDone from '../../assets/images/icon-launched.svg'
import { useHistory, useParams } from 'react-router-dom'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { isDaoframeSite } from 'utils/dao'
import { mycliqueUrl } from '../../constants'
import Button from 'components/Button/Button'

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
            <p style={{ position: 'absolute' }}>Launching Your DAO...</p>
          </div>
        </div>
      )}
      {isDone && (
        <div className="state-done">
          <div className="wrapper">
            <img src={IconDone} />
            <Button
              width="120px"
              onClick={() => {
                if (isDaoframeSite()) {
                  window.open(mycliqueUrl)
                } else {
                  history.replace(`/`)
                }
              }}
            >
              Get Started
            </Button>
          </div>
          <h3>All Done!</h3>
          <p>Your DAO has been created</p>
        </div>
      )}
    </main>
  )
}
