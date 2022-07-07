import { Box } from '@mui/material'
import { ProposalInfoProp } from 'hooks/useVoting'
import { timeStampToFormat } from 'utils/dao'
import ProposalStatus from '../ProposalStatus'
import styles from './index.module.less'

export default function Index({ detail }: { detail: ProposalInfoProp }) {
  return (
    <div className={styles['details']}>
      <div className={styles['details-header']}>
        <div className={styles['details-header-name']}>
          <p className={styles['title']}>{detail.title}</p>
        </div>
        <Box display={'flex'} justifyContent="space-between" alignItems="center">
          <Box display={'flex'} alignItems="center">
            <p className={styles['start-time']}>Start: {timeStampToFormat(detail.startTime)}</p>
            <ProposalStatus status={detail.status} />
          </Box>
          <p className={styles['end-time']}>End: {timeStampToFormat(detail.endTime)}</p>
        </Box>
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
