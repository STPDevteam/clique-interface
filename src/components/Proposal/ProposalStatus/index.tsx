import classNames from 'classnames'
import { ProposalStatusProp, ProposalStatusText } from 'hooks/useCreateCommunityProposalCallback'
import styles from './index.module.less'

export default function Index({ status }: { status: ProposalStatusProp }) {
  return (
    <div
      className={classNames(styles.status, {
        [styles.soon]: status === ProposalStatusProp.Review,
        [styles.open]: status === ProposalStatusProp.Active,
        [styles.closed]: status === ProposalStatusProp.Failed,
        [styles.open]: status === ProposalStatusProp.Success,
        [styles.closed]: status === ProposalStatusProp.Cancel,
        [styles.executable]: status === ProposalStatusProp.Executed
      })}
    >
      <span className={styles.dot}></span>
      <span className={styles.text}>{ProposalStatusText[status]}</span>
    </div>
  )
}
