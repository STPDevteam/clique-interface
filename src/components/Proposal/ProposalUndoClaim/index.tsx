import styles from './index.module.less'
import { Button } from 'antd'
import classNames from 'classnames'
import { ProposalInfoProp } from 'hooks/useVoting'
import { timeStampToFormat } from 'utils/dao'
import { DaoInfoProps } from 'hooks/useDAOInfo'

export default function Index({ detail, daoInfo }: { detail: ProposalInfoProp; daoInfo: DaoInfoProps }) {
  return (
    <div className={styles['undo-claim-container']}>
      <p className={styles['title']}>Details</p>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Proposer</span>
        <span className={styles['value']}>--</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Snapshot</span>
        <span className={styles['value']}>--</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Start time</span>
        <span className={styles['value']}>{timeStampToFormat(detail.startTime)}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>End time</span>
        <span className={styles['value']}>{timeStampToFormat(detail.endTime)}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Staked</span>
        <span className={styles['value']}>
          {daoInfo.rule?.minimumCreateProposal.toSignificant()} {daoInfo.token?.symbol}
        </span>
      </div>
      <Button className={classNames('btn-common btn-02', styles['btn-undo'])}>
        Undo proposals and claim my assets
      </Button>
    </div>
  )
}
