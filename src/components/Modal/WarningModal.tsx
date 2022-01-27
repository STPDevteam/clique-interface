import { useEffect } from 'react'
import { Close } from '@mui/icons-material'
import Button from 'components/Button/Button'
import Modal from './index'
import { Typography, Box } from '@mui/material'
import useModal from 'hooks/useModal'

const isDev = process.env.NODE_ENV === 'development'

export default function WarningModal() {
  const { showModal, hideModal } = useModal()

  useEffect(() => {
    if (isDev) return
    showModal(<WarningModalContent onDismiss={hideModal} />)
  }, [hideModal, showModal])

  return <></>
}

export function WarningModalContent({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal maxWidth="608px" width="100%">
      <Box display="grid" gap="24px" width="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <div />
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Important Note
          </Typography>
          <Close onClick={onDismiss} sx={{ cursor: 'pointer' }} />
        </Box>

        <Typography variant="inherit">
          Please note that the Dapp is only open to non-U.S. residents and entities. All users must meet eligibility
          requirements to participate.
          <br />
          <br />
          The Dapp is not and will not be offered, directly or indirectly, to any person who is a resident, organized,
          or located in any country or territory subject to OFAC comprehensive sanctions programs from time to time,
          including Cuba, Crimea region of Ukraine, Democratic people’s Republic of Korea, Iran, Syria, any person found
          on the OFAC specially designated nationals, blocked persons list, any other consolidated prohibited persons
          list as determined by any applicable governmental authority.
        </Typography>
        <Typography variant="inherit">The Dapp is in testnet version. Please use at your own risk.</Typography>
        <Button onClick={onDismiss}>Understand</Button>
      </Box>
    </Modal>
  )
}
