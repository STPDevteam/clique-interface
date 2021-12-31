import styles from './index.module.less'
import { Button } from 'antd'
import classNames from 'classnames'

export default function Index() {
  return (
    <div className={styles['undo-claim-container']}>
      <p className={styles['title']}>Details</p>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Proposer</span>
        <span className={styles['value']}>Apple3</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Snapshot</span>
        <span className={styles['value']}>0</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Start time</span>
        <span className={styles['value']}>2021-11-09 21:33:19</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>End time</span>
        <span className={styles['value']}>2021-11-09 21:33:19</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Staked</span>
        <span className={styles['value']}>2000 DFA</span>
      </div>
      <Button className={classNames('btn-common btn-02', styles['btn-undo'])}>
        Undo proposals and claim my assets
      </Button>
    </div>
  )
}
