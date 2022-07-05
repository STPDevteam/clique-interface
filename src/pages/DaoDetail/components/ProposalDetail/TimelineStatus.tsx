import { Box, styled, Typography } from '@mui/material'
import { Spin, Timeline } from 'antd'
import { Dots, ExternalLink } from 'theme/components'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'
import Button from 'components/Button/Button'
import { useActiveWeb3React } from 'hooks'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { ProposalInfoProp } from 'hooks/useVoting'
import { useProposalStatusDateline } from 'hooks/useBackedServer'
import { timeStampToFormat } from 'utils/dao'
import { getEtherscanLink } from 'utils'
import { DefaultChainId } from '../../../../constants'
import ProHistoryIcon from 'assets/images/pro-list-icon.png'

const LineDot = styled('div')({
  width: 20,
  height: 20,
  // boxShadow: 'inset 2px 2px 5px rgba(31, 36, 41, 0.4)',
  // boxShadow: '-3px -3px 8px rgba(255, 255, 255, 0.3), 5px 5px 13px rgba(174, 174, 174, 0.1)',
  background: `url(${ProHistoryIcon})`,
  borderRadius: '50%',
  backgroundSize: '100% 100%'
})
const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function TimelineStatus({
  detail,
  onExecuteProposal,
  votingAddress,
  isProposalExec
}: {
  detail: ProposalInfoProp
  onExecuteProposal: () => void
  votingAddress: string | undefined
  isProposalExec?: boolean
}) {
  const { account, chainId } = useActiveWeb3React()
  const { loading, result: dateline } = useProposalStatusDateline(votingAddress, detail.id, detail.status)

  return (
    <Box
      sx={{
        borderRadius: '24px',
        backgroundColor: '#fff',
        padding: '32px 32px 10px 32px',
        marginBottom: 24
      }}
    >
      <Typography variant="h6" mb={20} fontWeight={600}>
        Proposal history
      </Typography>

      {loading && (
        <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50} mb={50}>
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
      {dateline.length === 0 && <Box sx={{ height: 20 }}></Box>}
      {isProposalExec ? (
        <Button style={{ marginBottom: 20 }} disabled>
          Executing
          <Dots />
        </Button>
      ) : (
        account &&
        detail.status === ProposalStatusProp.Executable && (
          <Button style={{ marginBottom: 20 }} onClick={onExecuteProposal}>
            Execute proposal
          </Button>
        )
      )}
    </Box>
  )
}
