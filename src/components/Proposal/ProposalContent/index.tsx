import ProposalStatus from '../ProposalStatus'
import styles from './index.module.less'

export default function Index({ detail }: { detail: any }) {
  return (
    <div className={styles['details']}>
      <div className={styles['details-header']}>
        <div className={styles['details-header-name']}>
          <p className={styles['start-time']}>Started at {detail.startTime}</p>
          <p className={styles['title']}>{detail.name}</p>
          <p className={styles['end-time']}>Ended at {detail.endTime}</p>
        </div>
        <ProposalStatus status={detail.status} />
      </div>
      <p className={styles['text']}>{detail.desc}</p>
    </div>
  )
}
