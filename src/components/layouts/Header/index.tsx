import './pc.less'

import Logo from 'assets/images/logo.svg'
import { Button } from 'antd'
import WalletStatus from '../WalletStatus'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'

export default function Header() {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  return (
    <header>
      <div className="logo link" onClick={() => history.push('/')}>
        <img src={Logo} />
      </div>
      <div className="actions">
        <WalletStatus />
        {account && <Button className="btn-common btn-01 btn-create">Create DAO</Button>}
      </div>
    </header>
  )
}
