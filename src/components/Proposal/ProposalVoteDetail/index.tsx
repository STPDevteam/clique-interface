import styles from './index.module.less'
import { Button, Progress } from 'antd'
import classNames from 'classnames'
import { Box } from '@mui/material'
import useModal from 'hooks/useModal'
import VoteList from './VoteList'

export default function Index({ detail }: { detail: any }) {
  console.log('🚀 ~ file: index.tsx ~ line 5 ~ Index ~ detail', detail)
  const { showModal } = useModal()

  const votesAmount = 281
  const votes = [
    {
      desc:
        'Non-fungible token (NFT) refers to a unique type of digital assets. The ownership of these assets is circulated on various chains such as on the Ethereum blockchain.',
      percent: 0.8,
      votes: 3033
    },
    {
      desc: 'The first step is as good as half over',
      percent: 0.1,
      votes: 633
    },
    {
      desc: 'The first step is as good as half over',
      percent: 0.09,
      votes: 266
    }
  ]
  return (
    <div className={styles['vote-details']}>
      <p className={styles['title']}>Detail</p>
      <div className={styles['vote-list']}>
        {votes.map((item, index) => (
          <div key={index} className={styles['vote-item']}>
            <Box display={'flex'} gap={50} className={styles['vote-data-container']}>
              <p className={styles['vote-desc']}>{item.desc}</p>
              <div className={styles['vote-data']}>
                <p>{item.percent * 100}%</p>
                <p>{item.votes} Votes</p>
              </div>
            </Box>
            <Progress percent={item.percent * 100} showInfo={false} />
          </div>
        ))}
        <Button
          className={classNames('btn-common btn-02', styles['btn-view-all'])}
          onClick={() => showModal(<VoteList />)}
        >
          View all vote ({votesAmount})
        </Button>
      </div>
    </div>
  )
}
