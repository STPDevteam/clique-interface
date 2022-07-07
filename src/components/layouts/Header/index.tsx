import './pc.less'

import Logo from 'assets/images/logo.svg'
import DaoframeLogo from 'assets/svg/create_logo.svg'
import WalletStatus from '../WalletStatus'
import { NavLink, useHistory } from 'react-router-dom'
import { isDaoframeSite } from 'utils/dao'
import { Box, styled } from '@mui/material'

const StyledTab = styled(Box)(({ theme }) => ({
  '& .link': {
    height: theme.height.header,
    display: 'flex',
    marginLeft: 40,
    fontSize: 14,
    color: theme.palette.text.secondary,
    fontWeight: 600,
    alignItems: 'center',
    position: 'relative',
    textDecoration: 'none',
    '&:after': {
      content: '""',
      position: 'absolute',
      height: '4px',
      borderRadius: '2px 2px 0px 0px',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'transparent'
    },
    '&.active': {
      color: theme.palette.primary.main,
      '&:after': {
        background: theme.palette.primary.main
      }
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const tabs = [
  { name: 'Governance', route: '/governance' },
  { name: 'Creator', route: '/create' }
]

export default function Header() {
  const history = useHistory()
  return (
    <header>
      <Box className="logo link">
        <img src={isDaoframeSite() ? DaoframeLogo : Logo} onClick={() => history.push('/governance')} />
        <StyledTab display={'flex'}>
          {tabs.map(({ name, route }, index) => (
            <NavLink key={name + index} to={route ?? ''} className={'link'}>
              {name}
            </NavLink>
          ))}
        </StyledTab>
      </Box>
      <div className="actions">
        <WalletStatus />
      </div>
    </header>
  )
}
