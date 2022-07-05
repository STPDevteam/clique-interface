import './pc.less'
import { notification } from 'antd'
import { useActiveWeb3React } from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { getEtherscanLink } from 'utils'
import Copy from 'components/essential/Copy'
import { Typography, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'

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
      message: 'Copied successfully',
      top: 80
    })
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

export default function Accounts() {
  const { account, chainId } = useActiveWeb3React()
  const { deactivate } = useWeb3React()
  const theme = useTheme()

  return (
    <div className="modal-common">
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        {account ? 'Wallet' : 'Connect Wallet'}
      </Typography>
      {account && chainId && (
        <section className="loggedin">
          <div className="address">
            <Typography variant="h6">{account}</Typography>
            <Copy toCopy={account || ''} size={48} svgSize={20} />
          </div>
          <div className="btn-group">
            <OutlineButton onClick={() => window.open(getEtherscanLink(chainId, account, 'address'))}>
              View on blockchain
            </OutlineButton>
            <OutlineButton color={theme.palette.text.disabled} onClick={() => deactivate()}>
              Disconnect
            </OutlineButton>
          </div>
        </section>
      )}
    </div>
  )
}
