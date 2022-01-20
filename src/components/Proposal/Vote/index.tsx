import { useMemo, useState } from 'react'
import styles from './index.module.less'
import { Radio, Space, Button } from 'antd'
import classNames from 'classnames'
import { RadioChangeEvent } from 'antd/lib/radio'
import { ProposalInfoProp } from 'hooks/useVoting'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { Box, Typography } from '@mui/material'
import JSBI from 'jsbi'
import { TokenAmount } from 'constants/token'
import Confirm from './confirm'
import useModal from 'hooks/useModal'
import { useActiveWeb3React } from 'hooks'

export default function Index({
  detail,
  list,
  onVote,
  onExecuteProposalCallback,
  balanceAt,
  voteResults,
  minimumVote
}: {
  onVote: (index: number) => void
  balanceAt: TokenAmount | undefined
  detail: ProposalInfoProp
  onExecuteProposalCallback: () => void
  list: {
    name: string
    per: number
    votes: string | undefined
  }[]
  voteResults:
    | {
        amount: string
        id: string
        optionIndex: number
      }
    | undefined
  minimumVote: TokenAmount | undefined
}) {
  const { account } = useActiveWeb3React()
  const isVoted = useMemo(() => JSBI.GT(JSBI.BigInt(voteResults?.amount || 0), JSBI.BigInt(0)), [voteResults?.amount])
  const { showModal, hideModal } = useModal()
  const [voteIndex, setVoteIndex] = useState<number>()
  const handleChange = (e: RadioChangeEvent) => {
    setVoteIndex(e.target.value)
  }

  const voteBtn = useMemo(() => {
    if (detail.status !== ProposalStatusProp.Active) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          Close
        </Button>
      )
    }
    if (isVoted) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          You voted
        </Button>
      )
    }
    if (!balanceAt || !minimumVote || !balanceAt.greaterThan(minimumVote)) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          You votes insufficient
        </Button>
      )
    }
    if (voteIndex === undefined) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          Vote Now
        </Button>
      )
    }
    return (
      <Button
        className={classNames(styles['btn-vote'], 'btn-common btn-01')}
        onClick={() => {
          showModal(
            <Confirm
              balanceAt={balanceAt?.toSignificant(6, { groupSeparator: ',' }) || ''}
              optionName={list[voteIndex].name}
              onConfirm={() => onVote(voteIndex)}
              onHide={hideModal}
            />
          )
        }}
      >
        Vote Now
      </Button>
    )
  }, [balanceAt, detail.status, hideModal, isVoted, list, minimumVote, onVote, showModal, voteIndex])

  return (
    <div className={styles['vote-container']}>
      {isVoted ? (
        <div>
          <p className={styles.title}>Your choose</p>
          <Box display={'grid'} gap={5}>
            <Typography variant="body1">Voting for</Typography>
            <Typography variant="body1" fontWeight={500} color={'#22304A'}>
              {voteResults ? list[voteResults.optionIndex].name : ''}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Your Votes</Typography>
              <Typography variant="h6" fontSize={14}>
                {balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Minimum to vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {minimumVote?.toSignificant(6, { groupSeparator: ',' }) || '-'}
              </Typography>
            </Box>
            {voteBtn}
            {account && detail.status === ProposalStatusProp.Executable && (
              <Button
                className={classNames(styles['btn-vote'], 'btn-common btn-01')}
                onClick={onExecuteProposalCallback}
              >
                Execute proposal
              </Button>
            )}
          </Box>
        </div>
      ) : (
        <div>
          <p className={styles.title}>Cast your vote</p>
          <Box display={'grid'} gap={5}>
            <Radio.Group
              onChange={handleChange}
              value={voteIndex}
              disabled={detail.status !== ProposalStatusProp.Active}
              className="custom-radio"
            >
              <Space direction="vertical">
                {list.map((option, index) => (
                  <Radio key={index} value={index}>
                    {option.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Your Vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Minimum to vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {minimumVote?.toSignificant(6, { groupSeparator: ',' }) || '-'}
              </Typography>
            </Box>
            <Box display={'grid'} gap={10}>
              {voteBtn}
              {account && detail.status === ProposalStatusProp.Executable && (
                <Button
                  className={classNames(styles['btn-vote'], 'btn-common btn-01')}
                  onClick={onExecuteProposalCallback}
                >
                  Execute proposal
                </Button>
              )}
            </Box>
          </Box>
        </div>
      )}
    </div>
  )
}
