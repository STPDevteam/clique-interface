import { ProposalInfoProp } from 'hooks/useVoting'
import { shortenAddress } from 'utils'
import { timeStampToFormat } from 'utils/dao'
import styles from './index.module.less'

export default function Index({ detail }: { detail: ProposalInfoProp }) {
  return (
    <div className={styles['other-user-container']}>
      <p className={styles['out-title']}>Other user:</p>
      <div className={styles['other-user-detail']}>
        <p className={styles['title']}>Detail</p>
        <div className={styles['list-item']}>
          <span className={styles['label']}>Initiator</span>
          <span className={styles['value']}>{shortenAddress(detail.creator)}</span>
        </div>
        <div className={styles['list-item']}>
          <span className={styles['label']}>Snapshot</span>
          <span className={styles['value']}>{detail.blkHeight}</span>
        </div>
        <div className={styles['list-item']}>
          <span className={styles['label']}>Start time</span>
          <span className={styles['value']}>{timeStampToFormat(detail.startTime)}</span>
        </div>
        <div className={styles['list-item']}>
          <span className={styles['label']}>End time</span>
          <span className={styles['value']}>{timeStampToFormat(detail.endTime)}</span>
        </div>
      </div>
    </div>
  )
}
