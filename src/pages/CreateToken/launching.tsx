import '../building/launching.pc.less'

import { useMemo } from 'react'
import IconToken from '../../assets/images/icon-token.svg'
import IconLaunching from '../../assets/images/icon-launching.svg'
import IconDone from '../../assets/images/icon-launched.svg'
import { Button } from 'antd'
import { useParams } from 'react-router-dom'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useTransactionReceipt } from 'hooks/useTransactionReceipt'
import { Box } from '@mui/system'
import useCopyClipboard from 'hooks/useCopyClipboard'

export default function Launching() {
  const { hash } = useParams<{ hash: string }>()
  const [isCopy, setCopied] = useCopyClipboard()

  const isTransactionPending = useIsTransactionPending(hash)
  const receipt = useTransactionReceipt(hash)
  const address = useMemo(() => {
    return receipt?.logs[0].address
  }, [receipt])

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
          <p>Create Token...</p>
        </div>
      )}
      {isDone && (
        <div className="state-done">
          <Box pb={20}>{address}</Box>
          <div className="wrapper">
            <img src={IconDone} />
            <Button
              className="btn-common btn-03"
              onClick={() => {
                setCopied(address)
              }}
            >
              {isCopy ? 'Copy Success' : 'Copy Address'}
            </Button>
          </div>
          <h3>All Done!</h3>
          <p>Your token has been created</p>
        </div>
      )}
    </main>
  )
}
