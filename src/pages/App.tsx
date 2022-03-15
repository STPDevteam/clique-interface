import { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// import { styled } from '@mui/material'
import Layouts from '../components/layouts/index'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
// import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
// import Footer from 'components/Footer'
import 'antd/dist/antd.css'
import '../components/layouts/Sider/pc.less'
import '../assets/styles/global.pc.less'

import Home from './home'
import Daos from './Daos'
import DaoDetail from './DaoDetail'
import ExternalDetail from './ExternalDetail'
import Building from './building'
import Launching from './building/launching'
import ExternalBuilding from './ExternalBuilding'
import Offering from './offering'
import MyWallet from './myWallet'
import { isDaoframeSite, isMycliqueSite } from 'utils/dao'
import TopAlert from './TopAlert'

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <Web3ReactManager>
          <div id="app">
            {/* <ContentWrapper> */}
            <TopAlert />
            <Layouts>
              {/* <BodyWrapper id="body"> */}
              <Popups />
              <Polling />
              {/* <WarningModal /> */}

              <Switch>
                {/* <Route exact strict path="/test1" component={ComingSoon} /> */}
                {isMycliqueSite() ? (
                  <>
                    <Route exact strict path="/" component={Daos} />
                    <Route exact strict path="/detail/:address" component={DaoDetail} />
                    <Route exact strict path="/external_detail/:address" component={ExternalDetail} />
                    <Route exact strict path="/offering/:address" component={Offering} />
                    <Route exact strict path="/my_wallet" component={MyWallet} />
                  </>
                ) : isDaoframeSite() ? (
                  <>
                    <Route exact strict path="/create" component={Home} />
                    <Route exact strict path="/building" component={Building} />
                    <Route exact strict path="/building/launching/:hash" component={Launching} />
                    <Route exact strict path="/external_building" component={ExternalBuilding} />
                    <Route path="/">
                      <Redirect to="create" />
                    </Route>
                  </>
                ) : (
                  <>
                    <Route exact strict path="/" component={Daos} />
                    <Route exact strict path="/detail/:address" component={DaoDetail} />
                    <Route exact strict path="/external_detail/:address" component={ExternalDetail} />
                    <Route exact strict path="/offering/:address" component={Offering} />
                    <Route exact strict path="/my_wallet" component={MyWallet} />

                    <Route exact strict path="/create" component={Home} />
                    <Route exact strict path="/building" component={Building} />
                    <Route exact strict path="/building/launching/:hash" component={Launching} />
                    <Route exact strict path="/external_building" component={ExternalBuilding} />
                  </>
                )}
              </Switch>
              {/* </BodyWrapper> */}
            </Layouts>
            {/* <Footer /> */}
            {/* </ContentWrapper> */}
          </div>
        </Web3ReactManager>
      </ModalProvider>
    </Suspense>
  )
}
