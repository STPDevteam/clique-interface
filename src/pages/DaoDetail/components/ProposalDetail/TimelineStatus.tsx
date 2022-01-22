import { Box, styled, Typography } from '@mui/material'
import { Spin, Timeline } from 'antd'
import { ExternalLink } from 'theme/components'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { ProposalInfoProp } from 'hooks/useVoting'
import { useProposalStatusDateline } from 'hooks/useBackedServer'
import { timeStampToFormat } from 'utils/dao'
import { getEtherscanLink } from 'utils'
import { DefaultChainId } from '../../../../constants'

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
  onExecuteProposal,
  votingAddress
}: {
  detail: ProposalInfoProp
  onExecuteProposal: () => void
  votingAddress: string | undefined
}) {
  const { account, chainId } = useActiveWeb3React()
  const { loading, result: dateline } = useProposalStatusDateline(votingAddress, detail.id, detail.status)

  if (dateline.length === 0) return null
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

      {loading && (
        <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50}>
          <Spin size="large" tip="Loading..." />
        </Box>
      )}
      <Timeline>
        {dateline.map((item, index) => (
          <Timeline.Item key={index} dot={<LineDot />}>
            <FlexBetween sx={{ transform: 'translateY(-6px)' }}>
              <Box>
                <Typography color={'#22304A'} fontWeight={500}>
                  {item.name}
                </Typography>
                <Typography>{timeStampToFormat(item.timeStamp)}</Typography>
              </Box>
              {item.hash && (
                <ExternalLink href={getEtherscanLink(chainId || DefaultChainId, item.hash, 'transaction')}>
                  <OpenLink />
                </ExternalLink>
              )}
            </FlexBetween>
          </Timeline.Item>
        ))}
      </Timeline>
      {account && detail.status === ProposalStatusProp.Executable && (
        <Button style={{ marginBottom: 20 }} onClick={onExecuteProposal}>
          Execute proposal
        </Button>
      )}
    </Box>
  )
}
