import styles from './index.module.less'
import { Button, Progress } from 'antd'
import classNames from 'classnames'
import { Box } from '@mui/material'
import useModal from 'hooks/useModal'
import VoteList from './VoteList'

export default function Index({
  list
}: {
  list: {
    name: string
    per: number
    votes: string | undefined
  }[]
}) {
  const { showModal } = useModal()

  return (
    <div className={styles['vote-details']}>
      <p className={styles['title']}>Detail</p>
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
