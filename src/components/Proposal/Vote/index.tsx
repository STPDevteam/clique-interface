import { useState } from 'react'
import styles from './index.module.less'
import { Radio, Space, Button } from 'antd'
import classNames from 'classnames'
import { RadioChangeEvent } from 'antd/lib/radio'

export default function Index({
  list,
  onVote,
  balanceAt
}: {
  onVote: (index: number) => void
  balanceAt: string | undefined
  list: {
    name: string
    per: number
    votes: string | undefined
  }[]
}) {
  const [voteIndex, setVoteIndex] = useState<number>()
  const handleChange = (e: RadioChangeEvent) => {
    setVoteIndex(e.target.value)
  }
  return (
    <div className={styles['vote-container']}>
      <p className={styles.title}>Vote</p>
      <Radio.Group onChange={handleChange} value={voteIndex} className="custom-radio">
        <Space direction="vertical">
          {list.map((option, index) => (
            <Radio key={index} value={index}>
              {option.name}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div className={styles['your-vote']}>
        <p>Your Vote</p>
        <p>{balanceAt || '-'}</p>
      </div>
      <Button
        className={classNames(styles['btn-vote'], 'btn-common btn-01')}
        onClick={() => {
          if (voteIndex === undefined) {
            return
          }
          onVote(voteIndex)
        }}
      >
        Vote
      </Button>
    </div>
  )
}
