import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { styled } from '@mui/system'
import Button from 'components/Button/Button'
import { timeStampToFormat } from 'utils/dao'
import { TokenAmount } from 'constants/token'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function Confirm({
  onCreate,
  title,
  endTime,
  startTime,
  minimumCreateProposal
}: {
  onCreate: () => void
  title: string
  startTime: number
  endTime: number
  minimumCreateProposal: TokenAmount | undefined
}) {
  return (
    <Modal>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Confirm Proposal
      </Typography>
      <Box display={'grid'} gap={5} mt={30}>
        <Typography variant="body1">Your Proposal</Typography>
        <Typography variant="h6">{title}</Typography>
        <FlexBetween mt={20}>
          <Typography variant="body1">Start time</Typography>
          <Typography variant="h6">{timeStampToFormat(startTime)}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography variant="body1">End time</Typography>
          <Typography variant="h6">{timeStampToFormat(endTime)}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography variant="body1">You will stake</Typography>
          <Typography variant="h6">
            {minimumCreateProposal?.toSignificant(6, { groupSeparator: ',' })} {minimumCreateProposal?.token?.symbol}
          </Typography>
        </FlexBetween>
        <Box sx={{ backgroundColor: '#FAFAFA', padding: '14px 20px', borderRadius: '8px', margin: '20px 0' }}>
          <Typography variant="body1">
            Are you sure you want to vote for the above choice? This action cannot be undone.
          </Typography>
        </Box>

        <Box display={'flex'} justifyContent={'center'}>
          <Button width="240px" style={{ maxWidth: '65%' }} onClick={onCreate}>
            Stake {minimumCreateProposal?.token?.symbol} and Create
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
