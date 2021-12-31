import { useState } from 'react'
import { Radio, Space, Button } from 'antd'
import classNames from 'classnames'
import { RadioChangeEvent } from 'antd/lib/radio'
import styles from './index.module.less'
export default function Index() {
  const options = [
    {
      id: 1,
      desc:
        'Non-fungible token (NFT) refers to a unique type of digital assets. The ownership of these assets is circulated on various chains such as on the Ethereum blockchain.'
    },
    {
      id: 2,
      desc: 'The first step is as good as half over'
    },
    {
      id: 3,
      desc: 'The first step is as good as half over'
    },
    {
      id: 4,
      desc: 'The first step is as good as half over'
    }
  ]
  const [value, setValue] = useState(options[0].id)

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  return (
    <div className={styles['cast-vote-container']}>
      <p className={styles.title}>Cast your vote</p>
      <Radio.Group onChange={handleChange} value={value} className="custom-radio">
        <Space direction="vertical">
          {options.map(option => (
            <Radio key={option.id} value={option.id}>
              {option.desc}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div className={styles['your-vote']}>
        <p>Your Vote</p>
        <p>1000</p>
      </div>
      <Button className={classNames('btn-common btn-01', styles['btn-vote'])}>Vote</Button>
    </div>
  )
}
