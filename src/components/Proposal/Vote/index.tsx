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
  onResolveVotingResult,
  onExecuteProposalCallback,
  balanceAt,
  voteResults
}: {
  onVote: (index: number) => void
  balanceAt: TokenAmount | undefined
  detail: ProposalInfoProp
  onResolveVotingResult: () => void
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
}) {
  const { account } = useActiveWeb3React()
  const isVoted = useMemo(() => JSBI.GT(JSBI.BigInt(voteResults?.amount || 0), JSBI.BigInt(0)), [voteResults?.amount])
  const { showModal, hideModal } = useModal()
  const [voteIndex, setVoteIndex] = useState<number>()
  const handleChange = (e: RadioChangeEvent) => {
    setVoteIndex(e.target.value)
  }

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
              <Typography variant="body1">Your Vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'}
              </Typography>
            </Box>
            {account && detail.status === ProposalStatusProp.WaitFinish && (
              <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} onClick={onResolveVotingResult}>
                Resolve voting result
              </Button>
            )}
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
          <div className={styles['your-vote']}>
            <p>Your Votes</p>
            <p>{balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'}</p>
          </div>
          <Box display={'grid'} gap={10}>
            <Button
              className={classNames(styles['btn-vote'], 'btn-common btn-01')}
              disabled={
                detail.status !== ProposalStatusProp.Active ||
                voteIndex === undefined ||
                !balanceAt ||
                !balanceAt.greaterThan(JSBI.BigInt(0))
              }
              onClick={() => {
                if (voteIndex === undefined) {
                  return
                }
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
            {account && detail.status === ProposalStatusProp.WaitFinish && (
              <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} onClick={onResolveVotingResult}>
                Resolve voting result
              </Button>
            )}
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
      )}
    </div>
  )
}
