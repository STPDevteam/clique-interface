import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import { StrictMode } from 'react'
import { CssBaseline, ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material'
import ReactDOM from 'react-dom'
import theme from 'theme/index'
import ReactGA from 'react-ga4'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Blocklist from './components/essential/Blocklist'
import { NetworkContextName } from './constants'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import getLibrary from './utils/getLibrary'
import { isMobile } from 'react-device-detect'
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const browserHistory = createBrowserHistory()

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true })
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Blocklist>
          <Provider store={store}>
            <Updaters />
            <StyledEngineProvider injectFirst>
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Router history={browserHistory}>
                  <App />
                </Router>
              </MuiThemeProvider>
            </StyledEngineProvider>
          </Provider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.unregister()
