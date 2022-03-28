import './pc.less'

import Logo from 'assets/images/logo.svg'
import DaoframeLogo from 'assets/svg/create_logo.svg'
import WalletStatus from '../WalletStatus'
import { useHistory } from 'react-router-dom'
import { isDaoframeSite } from 'utils/dao'
import { Box } from '@mui/material'

export default function Header() {
  const history = useHistory()
  return (
    <header>
      <Box className="logo link" onClick={() => history.push('/')}>
        <img src={isDaoframeSite() ? DaoframeLogo : Logo} />
        {/* <Typography variant="body2" ml={isDaoframeSite() ? '-15px' : 5} sx={{ transform: 'translateY(5px)' }}>
          Beta
        </Typography> */}
      </Box>
      <div className="actions">
        <WalletStatus />
      </div>
    </header>
  )
}
