import './pc.less'

import Logo from 'assets/images/logo.svg'
import DaoframeLogo from 'assets/svg/create_logo.svg'
import WalletStatus from '../WalletStatus'
import { useHistory } from 'react-router-dom'
import { isDaoframeSite } from 'utils/dao'

export default function Header() {
  const history = useHistory()
  return (
    <header>
      <div className="logo link" onClick={() => history.push('/')}>
        <img src={isDaoframeSite() ? DaoframeLogo : Logo} />
      </div>
      <div className="actions">
        <WalletStatus />
      </div>
    </header>
  )
}
