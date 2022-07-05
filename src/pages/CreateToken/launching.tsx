import '../building/launching.pc.less'

import { useMemo } from 'react'
import IconLaunching from '../../assets/images/icon-launching.svg'
import IconDone from '../../assets/images/icon-launched.svg'
import { useParams } from 'react-router-dom'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useTransactionReceipt } from 'hooks/useTransactionReceipt'
import { Box } from '@mui/system'
import useCopyClipboard from 'hooks/useCopyClipboard'
import Button from 'components/Button/Button'

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
            <p style={{ position: 'absolute' }}>Launching Your Token...</p>
          </div>
        </div>
      )}
      {isDone && (
        <div className="state-done">
          <Box pb={20}>{address}</Box>
          <div className="wrapper">
            <img src={IconDone} />
            <Button
              width="120px"
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
