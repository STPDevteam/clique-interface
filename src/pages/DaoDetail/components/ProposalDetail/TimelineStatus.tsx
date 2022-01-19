import { Box, styled, Typography } from '@mui/material'
import { Timeline } from 'antd'
import { ExternalLink } from 'theme/components'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { ProposalInfoProp } from 'hooks/useVoting'

const LineDot = styled('div')({
  width: 24,
  height: 24,
  boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
  borderRadius: '5px'
})
const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function TimelineStatus({
  detail,
  onExecuteProposal
}: {
  detail: ProposalInfoProp
  onExecuteProposal: () => void
}) {
  const { account } = useActiveWeb3React()
  return (
    <Box
      sx={{
        boxShadow: 'inset 2px 2px 5px rgb(105 141 173 / 50%)',
        borderRadius: '8px',
        padding: '20px 41px 0',
        marginBottom: 24
      }}
    >
      <Typography variant="h6" mb={20}>
        Proposal history
      </Typography>
      <Timeline>
        <Timeline.Item dot={<LineDot />}>
          <FlexBetween sx={{ transform: 'translateY(-6px)' }}>
            <Box>
              <Typography color={'#22304A'} fontWeight={500}>
                Create
              </Typography>
              <Typography>Review at 12-10-2021, 17:00:00</Typography>
            </Box>
            <OpenLink />
          </FlexBetween>
        </Timeline.Item>
        <Timeline.Item dot={<LineDot />}>
          <FlexBetween sx={{ transform: 'translateY(-6px)' }}>
            <Box>
              <Typography color={'#22304A'} fontWeight={500}>
                Create
              </Typography>
              <Typography>Review at 12-10-2021, 17:00:00</Typography>
            </Box>
            <OpenLink />
          </FlexBetween>
        </Timeline.Item>
        <Timeline.Item dot={<LineDot />}>
          <FlexBetween sx={{ transform: 'translateY(-6px)' }}>
            <Box>
              <Typography color={'#22304A'} fontWeight={500}>
                Create
              </Typography>
              <Typography>Review at 12-10-2021, 17:00:00</Typography>
            </Box>
            <OpenLink />
          </FlexBetween>
        </Timeline.Item>
        <Timeline.Item dot={<LineDot />}>
          <FlexBetween sx={{ transform: 'translateY(-6px)' }}>
            <Box>
              <Typography color={'#22304A'} fontWeight={500}>
                Create
              </Typography>
              <Typography>Review at 12-10-2021, 17:00:00</Typography>
            </Box>
            <ExternalLink href="">
              <OpenLink />
            </ExternalLink>
          </FlexBetween>
        </Timeline.Item>
      </Timeline>
      {account && detail.status === ProposalStatusProp.Executable && (
        <Button style={{ marginBottom: 20 }} onClick={onExecuteProposal}>
          Execute proposal
        </Button>
      )}
    </Box>
  )
}
