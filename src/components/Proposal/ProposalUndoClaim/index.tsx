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
import { getEtherscanLink, shortenAddress } from 'utils'
import { TokenAmount } from 'constants/token'
import { useTagCompletedTx } from 'state/transactions/hooks'
import { Dots } from 'theme/components'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'
import { Link } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { CROSS_SUPPORT_IMPORT_NETWORK } from '../../../constants'

export default function Index({
  detail,
  daoInfo,
  stakedToken,
  tagKey,
  snapshot
}: {
  detail: ProposalInfoProp
  daoInfo: DaoInfoProps
  stakedToken: TokenAmount | undefined
  tagKey: string
  snapshot?: string
}) {
  const { chainId } = useActiveWeb3React()
  const isClaimed = useVotingClaimed(daoInfo.votingAddress, detail.id)
  const { showModal, hideModal } = useModal()
  const cancelProposalCallback = useCancelProposalCallback(daoInfo.votingAddress, tagKey + detail.id)
  const isCancelProposaling = useTagCompletedTx('proposalCancel', tagKey + detail.id, daoInfo.votingAddress)
  const claimProposalTokenCallback = useClaimProposalTokenCallback(daoInfo.votingAddress, tagKey + detail.id)
  const isClaimProposalTokening = useTagCompletedTx('claimProposalToken', tagKey + detail.id, daoInfo.votingAddress)

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

  const onClaimProposalTokenCallback = useCallback(() => {
    showModal(<TransactionPendingModal />)
    claimProposalTokenCallback(detail.id)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [detail.id, hideModal, showModal, claimProposalTokenCallback])

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
      return <OutlineButton onClick={onCancelProposalCallback}>Undo proposals and claim my assets</OutlineButton>
    }
    if (
      detail.status === ProposalStatusProp.Failed ||
      detail.status === ProposalStatusProp.Success ||
      detail.status === ProposalStatusProp.Executed
    ) {
      if (isClaimed === false) {
        if (isClaimProposalTokening) {
          return (
            <OutlineButton disabled>
              Claiming
              <Dots />
            </OutlineButton>
          )
        }
        return <OutlineButton onClick={onClaimProposalTokenCallback}>Claim</OutlineButton>
      }
    }
    return undefined
  }, [
    detail.status,
    isCancelProposaling,
    isClaimProposalTokening,
    isClaimed,
    onCancelProposalCallback,
    onClaimProposalTokenCallback
  ])

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
      <div className={styles['list-item']}>
        <span className={styles['label']}>Staked</span>
        <span className={styles['value']}>
          {isClaimed ? 0 : stakedToken?.toSignificant(6, { groupSeparator: ',' })} {stakedToken?.token?.symbol}
        </span>
      </div>
      {getBtn}
    </div>
  )
}
