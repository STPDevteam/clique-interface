import styles from './index.module.less'
import { ProposalInfoProp } from 'hooks/useVoting'
import { timeStampToFormat } from 'utils/dao'
import { ExternalDaoInfoProps } from 'hooks/useDAOInfo'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { useCallback, useMemo } from 'react'
import OutlineButton from 'components/Button/OutlineButton'
import { useCancelProposalCallback } from 'hooks/useCancelProposalCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { shortenAddress } from 'utils'

export default function CancelProposalUndo({
  detail,
  daoInfo,
  snapshot
}: {
  detail: ProposalInfoProp
  daoInfo: ExternalDaoInfoProps
  snapshot?: string
}) {
  const { showModal, hideModal } = useModal()
  const cancelProposalCallback = useCancelProposalCallback(daoInfo.votingAddress)

  const onCancelProposalCallback = useCallback(() => {
    showModal(<TransactionPendingModal />)
    cancelProposalCallback(detail.id)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch(err => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [detail.id, hideModal, showModal, cancelProposalCallback])

  const getBtn = useMemo(() => {
    if (detail.status === ProposalStatusProp.Review || detail.status === ProposalStatusProp.Active) {
      return <OutlineButton onClick={onCancelProposalCallback}>Undo proposals</OutlineButton>
    }
    return undefined
  }, [detail.status, onCancelProposalCallback])

  return (
    <div className={styles['undo-claim-container']}>
      <p className={styles['title']}>Detail</p>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Initiator</span>
        <span className={styles['value']}>{shortenAddress(detail.creator)}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Snapshot</span>
        <span className={styles['value']}>{detail.blkHeight || snapshot || '-'}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Start time</span>
        <span className={styles['value']}>{timeStampToFormat(detail.startTime)}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>End time</span>
        <span className={styles['value']}>{timeStampToFormat(detail.endTime)}</span>
      </div>
      {getBtn}
    </div>
  )
}
