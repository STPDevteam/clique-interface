import { ProposalInfoProp } from 'hooks/useVoting'
import { timeStampToFormat } from 'utils/dao'
import ProposalStatus from '../ProposalStatus'
import styles from './index.module.less'

export default function Index({ detail }: { detail: ProposalInfoProp }) {
  return (
    <div className={styles['details']}>
      <div className={styles['details-header']}>
        <div className={styles['details-header-name']}>
          <p className={styles['start-time']}>Started at {timeStampToFormat(detail.startTime)}</p>
          <p className={styles['title']}>{detail.title}</p>
          <p className={styles['end-time']}>Ended at {timeStampToFormat(detail.endTime)}</p>
        </div>
        <ProposalStatus status={detail.status} />
      </div>
      <p
        className={styles['text']}
        dangerouslySetInnerHTML={{
          __html: detail.content.replace(
            /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/g,
            '<a href="$1" target="_blank">$1</a>'
          )
        }}
      ></p>
    </div>
  )
}
