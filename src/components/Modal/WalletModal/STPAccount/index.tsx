import './pc.less'
import { notification, Button, Input } from 'antd'
import { useActiveWeb3React } from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'
import Copy from 'components/essential/Copy'

const { TextArea } = Input

export function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)

    notification.success({
      message: 'Copy successfully',
      top: 80
    })
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

const Accounts = () => {
  const { account, chainId } = useActiveWeb3React()
  const { deactivate } = useWeb3React()

  return (
    <div className="modal-common">
      <h1>{account ? 'Wallet' : 'Connect Wallet'}</h1>
      {account && chainId && (
        <section className="loggedin">
          <div className="address">
            <TextArea placeholder="account" rows={5} disabled value={account} />
            <Copy toCopy={account || ''} size={48} svgSize={20} />
          </div>
          <div className="btn-group">
            <ExternalLink href={getEtherscanLink(chainId, account, 'address')}>
              <Button className="btn-common btn-01">View on blockchain</Button>
            </ExternalLink>
            <Button className="btn-common btn-04" onClick={() => deactivate()}>
              Disconnect
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

export default Accounts
