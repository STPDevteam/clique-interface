import { Box } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'
import MessageBox from './MessageBox'

export default function TransactionSubmittedModal({
  children,
  hash,
  hideFunc
}: {
  hash?: string
  children?: React.ReactNode
  hideFunc?: () => void
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <MessageBox type={'success'} header={'Transaction Submitted'} hideFunc={hideFunc}>
      <Box display="grid" gap="20px" justifyContent="center">
        {children}
        {chainId && hash && (
          <ExternalLink
            underline="always"
            href={getEtherscanLink(chainId, hash, 'transaction')}
            style={{ color: '#000', fontSize: 12 }}
          >
            View on explorer
          </ExternalLink>
        )}
      </Box>
    </MessageBox>
  )
}
