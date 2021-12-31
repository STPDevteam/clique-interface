import { useState } from 'react'
import styles from './index.module.less'
import { Radio, Space, Button } from 'antd'
import classNames from 'classnames'
import { RadioChangeEvent } from 'antd/lib/radio'

export default function Index() {
  const [vote, setVote] = useState()
  const options = [
    {
      label: 'Approve',
      value: 1
    },
    {
      label: 'Disapprove',
      value: 0
    }
  ]
  const handleChange = (e: RadioChangeEvent) => {
    setVote(e.target.value)
  }
  return (
    <div className={styles['vote-container']}>
      <p className={styles.title}>Vote</p>
      <Radio.Group onChange={handleChange} value={vote} className="custom-radio">
        <Space direction="vertical">
          {options.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div className={styles['your-vote']}>
        <p>Your Vote</p>
        <p>1000</p>
      </div>
      <Button className={classNames(styles['btn-vote'], 'btn-common btn-01')}>Vote</Button>
    </div>
  )
}
