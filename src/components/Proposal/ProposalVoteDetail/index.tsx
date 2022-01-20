import styles from './index.module.less'
import { Button, Progress } from 'antd'
import classNames from 'classnames'
import { Box, Typography } from '@mui/material'
import useModal from 'hooks/useModal'
import VoteList from './VoteList'
import { TokenAmount } from 'constants/token'

export default function Index({
  list,
  minimumValidVotes
}: {
  list: {
    name: string
    per: number
    votes: string | undefined
  }[]
  minimumValidVotes: TokenAmount | undefined
}) {
  const { showModal } = useModal()

  return (
    <div className={styles['vote-details']}>
      <Box display={'flex'} gap={20} alignItems={'center'} mb={10}>
        <Typography variant="h6" fontSize={20}>
          Current Results
        </Typography>
        <Typography>
          (Minimum valid votes:{minimumValidVotes?.toSignificant(6, { groupSeparator: ',' })}{' '}
          {minimumValidVotes?.token.symbol})
        </Typography>
      </Box>
      <div className={styles['vote-list']}>
        {list.map((item, index) => (
          <div key={index} className={styles['vote-item']}>
            <Box display={'flex'} gap={50} className={styles['vote-data-container']}>
              <p className={styles['vote-desc']}>{item.name}</p>
              <div className={styles['vote-data']}>
                <p>{item.per * 100}%</p>
                <p>{item.votes} Votes</p>
              </div>
            </Box>
            <Progress percent={item.per * 100} showInfo={false} />
          </div>
        ))}
        <Button
          className={classNames('btn-common btn-02', styles['btn-view-all'])}
          onClick={() => showModal(<VoteList />)}
        >
          View all vote
        </Button>
      </div>
    </div>
  )
}
