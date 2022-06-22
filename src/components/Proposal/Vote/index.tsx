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
import { Dots } from 'theme/components'

export default function Index({
  detail,
  list,
  onVote,
  balanceAt,
  voteResults,
  minimumVote,
  isVoting
}: {
  onVote: (index: number) => void
  balanceAt: TokenAmount | undefined
  detail: ProposalInfoProp
  isVoting?: boolean
  list: {
    name: string
    per: number
    votes: TokenAmount | undefined
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
  const isVoted = useMemo(() => JSBI.GT(JSBI.BigInt(voteResults?.amount || 0), JSBI.BigInt(0)), [voteResults?.amount])
  const { showModal, hideModal } = useModal()
  const [voteIndex, setVoteIndex] = useState<number>()
  const handleChange = (e: RadioChangeEvent) => {
    setVoteIndex(e.target.value)
  }

  const voteBtn = useMemo(() => {
    if (detail.status !== ProposalStatusProp.Active) {
      return null
    }
    if (isVoted) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          You voted
        </Button>
      )
    }
    if (isVoting) {
      return (
        <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')} disabled>
          Voting
          <Dots />
        </Button>
      )
    }
    if (!balanceAt || !minimumVote || minimumVote.greaterThan(balanceAt)) {
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
  }, [balanceAt, detail.status, hideModal, isVoted, isVoting, list, minimumVote, onVote, showModal, voteIndex])

  return (
    <div className={styles['vote-container']}>
      {isVoted ? (
        <div>
          <p className={styles.title}>Your choice</p>
          <Box display={'grid'} gap={5}>
            <Typography variant="body1">Voting for</Typography>
            <Typography variant="h6">{voteResults ? list[voteResults.optionIndex].name : ''}</Typography>
            <Box display={'flex'} mt={10} justifyContent={'space-between'}>
              <Typography variant="body1">Your holdings</Typography>
              <Typography variant="h6" fontSize={14}>
                {balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'} {minimumVote?.token.symbol}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Minimum holding to vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {minimumVote?.toSignificant(6, { groupSeparator: ',' }) || '-'} {minimumVote?.token.symbol}
              </Typography>
            </Box>
            {voteBtn}
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
            <Box display={'flex'} mt={10} justifyContent={'space-between'}>
              <Typography variant="body1">Your holdings</Typography>
              <Typography variant="h6" fontSize={14}>
                {balanceAt?.toSignificant(6, { groupSeparator: ',' }) || '-'} {minimumVote?.token.symbol}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1">Minimum holding to vote</Typography>
              <Typography variant="h6" fontSize={14}>
                {minimumVote?.toSignificant(6, { groupSeparator: ',' }) || '-'} {minimumVote?.token.symbol}
              </Typography>
            </Box>
            {voteBtn}
          </Box>
        </div>
      )}
    </div>
  )
}
