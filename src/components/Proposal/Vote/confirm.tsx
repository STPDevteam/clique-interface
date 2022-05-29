import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'

export default function Confirm({
  onConfirm,
  optionName,
  balanceAt,
  onHide
}: {
  onConfirm: () => void
  balanceAt: string
  optionName: string
  onHide: () => void
}) {
  return (
    <Modal closeIcon>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Confirm Vote
      </Typography>
      <Box display={'grid'} gap={5} mt={30}>
        <Typography variant="body1">Voting for</Typography>
        <Typography variant="body1" color={'#22304A'}>
          {optionName}
        </Typography>

        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1">Your holdings</Typography>
          <Typography variant="h6">{balanceAt}</Typography>
        </Box>

        <Box display={'flex'} justifyContent={'space-between'} mt={20} gap={40}>
          <OutlineButton onClick={onHide}>Cancel</OutlineButton>
          <Button onClick={onConfirm}>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  )
}
