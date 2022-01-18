import './pc.less'

import Logo from 'assets/images/logo.svg'
import WalletStatus from '../WalletStatus'
import { useHistory } from 'react-router-dom'

export default function Header() {
  const history = useHistory()
  return (
    <header>
      <div className="logo link" onClick={() => history.push('/')}>
        <img src={Logo} />
      </div>
      <div className="actions">
        <WalletStatus />
      </div>
    </header>
  )
}
