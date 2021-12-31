import styles from './index.module.less'
import ProposalStatus from '../ProposalStatus'

export default function Index() {
  return (
    <div className={styles['executable-container']}>
      <div className={styles['header']}>
        <div className={styles['header-left']}>
          <p className={styles['title']}>Withdraw</p>
          <p className={styles['closed']}>Closed at {'2021-11-11 11:11:11'}</p>
        </div>
        <ProposalStatus status={'Executable'} />
      </div>
      <p className={styles['info']}>I will use this token as gas fee</p>
      <div className={styles['payload']}>
        <p className={styles['title']}>Payload</p>
        <p className={styles['content']}>
          Action: Withdraw 100,000 USDT Execution Time: 2021-11-17 14:57:30 Submitter:
          0xd97dA63d086d222EDE0aa8ee8432031465EEF Executor: 0xd97dA63d086d222EDE0aa8ee8432031465EEF
        </p>
      </div>
    </div>
  )
}
