import { Suspense, useEffect } from 'react'
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

// import Home from './home'
import Home from './home/index_polygon'
import Daos from './Daos'
// import DaoDetail from './DaoDetail'
// import ExternalDetail from './ExternalDetail'
import CrossDetail from './CrossDetail'
// import Building from './building'
import Launching from './building/launching'
// import ExternalBuilding from './ExternalBuilding'
// import Offering from './offering'
import MyWallet from './myWallet'
import { isDaoframeSite, isMycliqueSite } from 'utils/dao'
// import TopAlert from './TopAlert'
// import Staking from './staking'
// import StakingCreate from './staking/Create'

import CrossBuilding from './CrossBuilding'
import CreateToken from './CreateToken'
import TokenLaunching from './CreateToken/launching'

import Verify from './Verify'

import BigNumber from 'bignumber.js'
import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
BigNumber.config({ EXPONENTIAL_AT: [-7, 40] })

export default function App() {
  useEffect(() => {
    // const interval = setInterval(() => {
    //   for (const item of document.querySelectorAll('.hide')) {
    //     item?.remove()
    //   }
    // }, 5000)

    isDaoframeSite() && (document.title = 'framework')

    // return () => {
    //   window.clearInterval(interval)
    // }
  }, [])

  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <Web3ReactManager>
          <div id="app">
            <Route component={GoogleAnalyticsReporter} />
            {/* <ContentWrapper> */}
            {/* <TopAlert /> */}
            <Layouts>
              {/* <BodyWrapper id="body"> */}
              <Popups />
              <Polling />
              {/* <WarningModal /> */}

              <Switch>
                {/* <Route exact strict path="/test1" component={ComingSoon} /> */}
                {isMycliqueSite() ? (
                  <>
                    <Route exact strict path="/governance" component={Daos} />
                    {/* <Route exact strict path="/detail/:address" component={DaoDetail} /> */}
                    {/* <Route exact strict path="/external_detail/:address" component={ExternalDetail} /> */}
                    <Route exact strict path="/cross_detail/:address" component={CrossDetail} />
                    <Route exact strict path="/verify" component={Verify} />
                    {/* <Route exact strict path="/offering/:address" component={Offering} /> */}
                    <Route exact strict path="/my_wallet" component={MyWallet} />
                    {/* <Route exact strict path="/staking" component={Staking} />
                    <Route exact strict path="/staking/create" component={StakingCreate} /> */}
                    <Route exact path="/" render={() => <Redirect to="/governance" />} />
                  </>
                ) : isDaoframeSite() ? (
                  <>
                    <Route exact strict path="/" component={Home} />
                    <Route exact strict path="/create" component={Home} />
                    {/* <Route exact strict path="/building" component={Building} /> */}
                    <Route exact strict path="/building/launching/:hash" component={Launching} />
                    {/* <Route exact strict path="/external_building" component={ExternalBuilding} /> */}
                    <Route exact strict path="/cross_building" component={CrossBuilding} />
                    {/* <Route exact strict path="/create_token" component={CreateToken} />
                    <Route exact strict path="/create_token/launching/:hash" component={TokenLaunching} /> */}
                    {/* <Route exact strict path="/staking" component={Staking} />
                    <Route exact strict path="/staking/create" component={StakingCreate} /> */}
                  </>
                ) : (
                  <>
                    <Route exact strict path="/governance" component={Daos} />
                    {/* <Route exact strict path="/detail/:address" component={DaoDetail} /> */}
                    {/* <Route exact strict path="/external_detail/:address" component={ExternalDetail} /> */}
                    <Route exact strict path="/cross_detail/:address" component={CrossDetail} />
                    {/* <Route exact strict path="/offering/:address" component={Offering} /> */}
                    <Route exact strict path="/my_wallet" component={MyWallet} />

                    <Route exact strict path="/create" component={Home} />
                    {/* <Route exact strict path="/building" component={Building} /> */}
                    <Route exact strict path="/building/launching/:hash" component={Launching} />
                    {/* <Route exact strict path="/external_building" component={ExternalBuilding} /> */}

                    <Route exact strict path="/cross_building" component={CrossBuilding} />
                    <Route exact strict path="/create_token" component={CreateToken} />
                    <Route exact strict path="/verify" component={Verify} />
                    <Route exact strict path="/create_token/launching/:hash" component={TokenLaunching} />
                    {/* <Route exact strict path="/staking" component={Staking} />
                    <Route exact strict path="/staking/create" component={StakingCreate} /> */}
                    <Route exact path="/" render={() => <Redirect to="/governance" />} />
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
