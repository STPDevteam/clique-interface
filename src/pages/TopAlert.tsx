import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { faucetClaimTT } from 'utils/fetch/faucet'
import { Alert, message } from 'antd'
import { Box } from '@mui/material'

export default function TopAlert() {
  const { account, chainId } = useActiveWeb3React()
  const claim = useCallback(() => {
    if (!chainId || !account) return
    faucetClaimTT(chainId, account)
      .then(res => {
        if (res.data.code !== 0) {
          message.warning(res.data.msg)
          return
        }
        message.success('Claim TT success on Klaytn Baobab')
      })
      .catch(() => {
        message.error('Network error')
      })
  }, [account, chainId])

  return (
    <Box sx={{ position: 'fixed', width: '100%', zIndex: 999 }}>
      {chainId === 1001 && account ? (
        <Alert
          message={
            <>
              Claim test token TT to {account} click{' '}
              <span style={{ color: '#3898FC', cursor: 'pointer' }} onClick={claim}>
                here.
              </span>
            </>
          }
          type="info"
        />
      ) : (
        <Alert
          message={
            <>
              Participate in the Verse Testnet node competition, view{' '}
              <a
                target="_blank"
                href="https://stp-dao.gitbook.io/verse-network/wallet-setup/interact-with-verse-testnet-using-metamask"
                rel="noreferrer"
              >
                tutorials{' '}
              </a>
              .
            </>
          }
          type="info"
        />
      )}
    </Box>
  )
}
