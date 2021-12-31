import styles from './index.module.less'
import { Progress, Button } from 'antd'

export default function Index() {
  return (
    <div className={styles['current-vote-results']}>
      <p className={styles['title']}></p>
      <div className={styles['vote-item']}>
        <p className={styles['label']}>Approve</p>
        <Progress showInfo={false} percent={30} />
      </div>
      <div className={styles['vote-item']}>
        <p className={styles['label']}>Disapprove</p>
        <Progress showInfo={false} percent={70} />
      </div>
      <Button className="btn-common btn-view-all">View all vote(28)</Button>
    </div>
  )
}
