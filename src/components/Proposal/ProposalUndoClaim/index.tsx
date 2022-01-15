import styles from './index.module.less'
import { ProposalInfoProp, useVotingClaimed } from 'hooks/useVoting'
import { timeStampToFormat } from 'utils/dao'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import { useCallback, useMemo } from 'react'
import OutlineButton from 'components/Button/OutlineButton'
import { useCancelProposalCallback } from 'hooks/useCancelProposalCallback'
import { useClaimProposalTokenCallback } from 'hooks/useClaimProposalTokenCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

export default function Index({ detail, daoInfo }: { detail: ProposalInfoProp; daoInfo: DaoInfoProps }) {
  const isClaimed = useVotingClaimed(daoInfo.votingAddress, detail.id)
  const { showModal, hideModal } = useModal()
  const cancelProposalCallback = useCancelProposalCallback(daoInfo.votingAddress)
  const claimProposalTokenCallback = useClaimProposalTokenCallback(daoInfo.votingAddress)

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

  const onClaimProposalTokenCallback = useCallback(() => {
    showModal(<TransactionPendingModal />)
    claimProposalTokenCallback(detail.id)
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
  }, [detail.id, hideModal, showModal, claimProposalTokenCallback])

  const getBtn = useMemo(() => {
    if (detail.status === ProposalStatusProp.Review || detail.status === ProposalStatusProp.Active) {
      return <OutlineButton onClick={onCancelProposalCallback}>Undo proposals and claim my assets</OutlineButton>
    }
    if (
      detail.status === ProposalStatusProp.Failed ||
      detail.status === ProposalStatusProp.Success ||
      detail.status === ProposalStatusProp.Executed
    ) {
      if (isClaimed === false) return <OutlineButton onClick={onClaimProposalTokenCallback}>Claim</OutlineButton>
    }
    return undefined
  }, [detail.status, isClaimed, onCancelProposalCallback, onClaimProposalTokenCallback])

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
      {getBtn}
    </div>
  )
}
