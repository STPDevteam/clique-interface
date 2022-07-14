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
import { getEtherscanLink, shortenAddress } from 'utils'
import { useTagCompletedTx } from 'state/transactions/hooks'
import { Dots } from 'theme/components'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'
import { Link } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { CROSS_SUPPORT_IMPORT_NETWORK } from '../../../constants'

export default function CancelProposalUndo({
  detail,
  daoInfo,
  tagKey,
  snapshot
}: {
  detail: ProposalInfoProp
  daoInfo: ExternalDaoInfoProps
  snapshot?: string
  tagKey: string
}) {
  const { chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const cancelProposalCallback = useCancelProposalCallback(daoInfo.votingAddress, tagKey + detail.id)
  const isCancelProposaling = useTagCompletedTx('proposalCancel', tagKey + detail.id, daoInfo.votingAddress)

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
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [detail.id, hideModal, showModal, cancelProposalCallback])

  const getBtn = useMemo(() => {
    if (isCancelProposaling) {
      return (
        <OutlineButton disabled>
          Canceling
          <Dots />
        </OutlineButton>
      )
    }
    if (detail.status === ProposalStatusProp.Review || detail.status === ProposalStatusProp.Active) {
      return <OutlineButton onClick={onCancelProposalCallback}>Undo proposals</OutlineButton>
    }
    return undefined
  }, [detail.status, isCancelProposaling, onCancelProposalCallback])

  return (
    <div className={styles['undo-claim-container']}>
      <p className={styles['title']}>Detail</p>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Initiator</span>
        <span className={styles['value']}>{shortenAddress(detail.creator)}</span>
      </div>
      <div className={styles['list-item']}>
        <span className={styles['label']}>Block height</span>
        <span className={styles['value']}>
          {detail.blkHeight || snapshot || '-'}
          <Link
            target={'_blank'}
            href={
              chainId && detail.blkHeight
                ? getEtherscanLink(chainId, detail.blkHeight.toString(), 'block')
                : snapshot
                ? getEtherscanLink(CROSS_SUPPORT_IMPORT_NETWORK[0], snapshot.toString(), 'block')
                : undefined
            }
          >
            <OpenLink height={18} />
          </Link>
        </span>
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
