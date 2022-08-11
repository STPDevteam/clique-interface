import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import { styled } from '@mui/system'
import Button from 'components/Button/Button'
import { timeStampToFormat } from 'utils/dao'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'theme/components'
import xss from 'xss'

const FlexBetween = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function Confirm({
  startTime,
  endTime,
  minimumCreateProposal,
  updateLog,
  votingAddress,
  onCommit
}: {
  startTime: number
  endTime: number
  updateLog: string
  minimumCreateProposal: TokenAmount
  onCommit: () => void
  votingAddress: string | undefined
}) {
  const { account } = useActiveWeb3React()
  const balance = useTokenBalance(account || undefined, minimumCreateProposal.token)
  const [approvalState, approvalCallback] = useApproveCallback(minimumCreateProposal, votingAddress)

  const btn = useMemo(() => {
    if (!balance || balance.lessThan(minimumCreateProposal))
      return (
        <Button width="100%" style={{ maxWidth: '65%' }} disabled>
          Balance is not sufficient to update configuration
        </Button>
      )
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return (
          <Button width="240px" disabled>
            Approval
            <Dots />
          </Button>
        )
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return (
          <Button width="240px" onClick={approvalCallback}>
            Approval
          </Button>
        )
      } else {
        return (
          <Button width="240px" disabled>
            Loading
            <Dots />
          </Button>
        )
      }
    }
    return (
      <Button width="240px" style={{ maxWidth: '65%' }} onClick={onCommit}>
        Create a proposal
      </Button>
    )
  }, [approvalCallback, approvalState, balance, minimumCreateProposal, onCommit])

  return (
    <Modal closeIcon>
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Confirm Proposal
      </Typography>
      <Box display={'grid'} gap={5} mt={30}>
        <Typography variant="body1">{`Original config -> Change to`}</Typography>
        <Box
          sx={{
            background: '#FAFAFA',
            boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
            borderRadius: '8px',
            padding: '17px 24px'
          }}
        >
          <Typography
            variant="body1"
            color={'#22304A'}
            dangerouslySetInnerHTML={{ __html: xss(updateLog) }}
          ></Typography>
        </Box>
        <FlexBetween mt={20}>
          <Typography variant="body1">Start time</Typography>
          <Typography variant="h6">{timeStampToFormat(startTime)}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography variant="body1">End time</Typography>
          <Typography variant="h6">{timeStampToFormat(endTime)}</Typography>
        </FlexBetween>

        <FlexBetween>
          <Typography variant="body1">Your balance</Typography>
          <Typography variant="h6">
            {balance?.toSignificant(6, { groupSeparator: ',' }) || '-'} {minimumCreateProposal.token.symbol}
          </Typography>
        </FlexBetween>

        <FlexBetween>
          <Typography variant="body1">Minimum balance needed</Typography>
          <Typography variant="h6">
            {minimumCreateProposal.toSignificant(6, { groupSeparator: ',' })} {minimumCreateProposal.token.symbol}
          </Typography>
        </FlexBetween>

        <Box display={'flex'} justifyContent={'center'} mt={20}>
          {btn}
        </Box>
      </Box>
    </Modal>
  )
}
