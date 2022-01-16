import classNames from 'classnames'
import { ProposalStatusProp, ProposalStatusText } from 'hooks/useCreateCommunityProposalCallback'
import styles from './index.module.less'

export default function Index({ status }: { status: ProposalStatusProp }) {
  return (
    <div
      className={classNames(styles.status, {
        [styles.soon]: status === ProposalStatusProp.Review,
        [styles.open]: status === ProposalStatusProp.Active || status === ProposalStatusProp.WaitFinish,
        [styles.closed]: status === ProposalStatusProp.Failed || status === ProposalStatusProp.Cancel,
        [styles.success]:
          status === ProposalStatusProp.Success ||
          status === ProposalStatusProp.Executed ||
          status === ProposalStatusProp.Executable
      })}
    >
      <span className={styles.dot}></span>
      <span className={styles.text}>{ProposalStatusText[status]}</span>
    </div>
  )
}
