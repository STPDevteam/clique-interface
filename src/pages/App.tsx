import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
// import { styled } from '@mui/material'
import Layouts from '../components/layouts/index'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
// import Footer from 'components/Footer'
import 'antd/dist/antd.css'
import '../components/layouts/Sider/pc.less'
import '../assets/styles/global.pc.less'

import Home from './home'
import Daos from './Daos'
import DaoDetail from './DaoDetail'
import Building from './building'
import Launching from './building/launching'
import Offering from './offering'

// const AppWrapper = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'flex-start',
//   overflowX: 'hidden',
//   [theme.breakpoints.down('md')]: {
//     flexDirection: 'column',
//     height: '100vh'
//   }
// }))

// const ContentWrapper = styled('div')({
//   width: '100%',
//   maxHeight: '100vh',
//   overflow: 'auto',
//   alignItems: 'center'
// })

// const BodyWrapper = styled('div')(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   width: '100%',
//   minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.footer})`,
//   padding: '50px 0 80px',
//   justifyContent: 'center',
//   alignItems: 'center',
//   flex: 1,
//   overflowY: 'auto',
//   overflowX: 'hidden',
//   position: 'relative',
//   [theme.breakpoints.down('md')]: {
//     minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
//     paddingTop: 20
//   }
// }))

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <div id="app">
          {/* <ContentWrapper> */}
          <Layouts>
            {/* <BodyWrapper id="body"> */}
            <Popups />
            <Polling />
            <WarningModal />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/test1" component={ComingSoon} />
                <Route exact strict path="/" component={Daos} />
                <Route exact strict path="/create" component={Home} />
                <Route exact strict path="/building" component={Building} />
                <Route exact strict path="/building/launching/:hash" component={Launching} />
                <Route exact strict path="/detail/:address" component={DaoDetail} />
                <Route exact strict path="/offering/:address" component={Offering} />
              </Switch>
            </Web3ReactManager>
            {/* </BodyWrapper> */}
          </Layouts>
          {/* <Footer /> */}
          {/* </ContentWrapper> */}
        </div>
      </ModalProvider>
    </Suspense>
  )
}
