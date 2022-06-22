import { useEffect, useState, useCallback } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { isMobile } from 'react-device-detect'
import { Typography, Box } from '@mui/material'
import MetamaskIcon from 'assets/walletIcon/metamask.png'
import { fortmatic, injected, portis } from 'connectors'
import { OVERLAY_READY } from 'connectors/Fortmatic'
import { DefaultChainId, SUPPORTED_WALLETS } from 'constants/index'
import usePrevious from 'hooks/usePrevious'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useWalletModalToggle } from 'state/application/hooks'
import AccountDetails from 'components/Modal/WalletModal/STPAccount'

import Modal from '../index'
import Option from './Option'
import PendingView from './PendingView'
import OutlineButton from 'components/Button/OutlineButton'
import useBreakpoint from 'hooks/useBreakpoint'
import Button from 'components/Button/Button'
import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pendingTransactions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmedTransactions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  const isUpToMD = useBreakpoint('md')
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = useCallback(
    async (connector: AbstractConnector | undefined) => {
      setPendingWallet(connector) // set wallet for pending view
      setWalletView(WALLET_VIEWS.PENDING)

      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
        connector.walletConnectProvider = undefined
      }

      connector &&
        activate(connector, undefined, true).catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
          } else {
            setPendingError(true)
          }
        })
    },
    [activate]
  )

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              icon={require('../../../assets/walletIcon/' + option.iconName)?.default}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header={'Install Metamask'}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            link={option.href}
            header={option.name}
            icon={require('../../../assets/walletIcon/' + option.iconName)?.default}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <>
          <Typography variant="h6">
            {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}
          </Typography>
          <Box padding={isUpToMD ? '16px' : '2rem 6rem 52px'}>
            {error instanceof UnsupportedChainIdError
              ? 'Please connect to a supported network in the dropdown menu or in your wallet.'
              : 'Error connecting. Try refreshing the page.'}
          </Box>
          {window.ethereum && window.ethereum.isMetaMask && (
            <Button
              onClick={() => {
                const id = Object.values(ChainId).find(val => val === DefaultChainId)
                if (!id) {
                  return
                }
                const params = SUPPORTED_NETWORKS[id as ChainId]
                params?.nativeCurrency.symbol === 'ETH'
                  ? window.ethereum?.request?.({
                      method: 'wallet_switchEthereumChain',
                      params: [{ chainId: params.chainId }, account]
                    })
                  : window.ethereum?.request?.({ method: 'wallet_addEthereumChain', params: [params, account] })
              }}
            >
              Connect to {SUPPORTED_NETWORKS[DefaultChainId] ? SUPPORTED_NETWORKS[DefaultChainId]?.chainName : ''}
            </Button>
          )}
        </>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        // <AccountDetails
        //   toggleWalletModal={toggleWalletModal}
        //   pendingTransactions={pendingTransactions}
        //   confirmedTransactions={confirmedTransactions}
        //   ENSName={ENSName}
        //   openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        // />
        <AccountDetails />
      )
    }
    return (
      <>
        {walletView === WALLET_VIEWS.ACCOUNT && <Typography variant="h6">Connect Wallet</Typography>}

        {walletView === WALLET_VIEWS.PENDING ? (
          <PendingView
            connector={pendingWallet}
            error={pendingError}
            setPendingError={setPendingError}
            tryActivation={tryActivation}
          >
            <OutlineButton
              primary
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              Change Wallet
            </OutlineButton>
          </PendingView>
        ) : (
          <Box display="grid" gap="10px" width="100%" justifyContent="center">
            {getOptions()}
          </Box>
        )}
      </>
    )
  }

  return (
    <Modal customIsOpen={walletModalOpen} customOnDismiss={toggleWalletModal} maxWidth="520px" closeIcon={true}>
      <Box width={'100%'} display="flex" flexDirection="column" gap={20}>
        {getModalContent()}
      </Box>
    </Modal>
  )
}
