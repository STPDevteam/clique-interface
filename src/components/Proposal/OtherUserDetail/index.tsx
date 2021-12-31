import styles from './index.module.less'

export default function Index() {
  return (
    <div className={styles['other-user-container']}>
      <p className={styles['out-title']}>Other user:</p>
      <div className={styles['other-user-detail']}>
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
      </div>
    </div>
  )
}
