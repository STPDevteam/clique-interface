import styles from './index.module.less'
import { Button } from 'antd'
import ProposalContent from '../../../../components/Proposal/ProposalContent'
import ProposalVoteDetail from '../../../../components/Proposal/ProposalVoteDetail'
// import CastVote from '../../../../components/Proposal/CastVote'
import ProposalUndoClaim from '../../../../components/Proposal/ProposalUndoClaim'
import OtherUserDetail from '../../../../components/Proposal/OtherUserDetail'
import ExecutableContent from '../../../../components/Proposal/ExecutableContent'
import ExecutableVoteResult from '../../../../components/Proposal/ExecutableVoteResult'
import Vote from '../../../../components/Proposal/Vote'
import { Grid } from '@mui/material'
import { ProposalInfoProp, useBalanceOfAt, useVotingOptionsById } from 'hooks/useVoting'
import { ProposalType } from 'hooks/useCreateCommunityProposalCallback'
import { useVoteCallback } from 'hooks/useVoteCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useCallback, useMemo } from 'react'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { TokenAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import JSBI from 'jsbi'

export default function Index({
  detail,
  onBack,
  daoInfo
}: {
  detail: ProposalInfoProp
  onBack: () => void
  daoInfo: DaoInfoProps
}) {
  const voteCallback = useVoteCallback(daoInfo.votingAddress)
  const balanceOfAt = useBalanceOfAt(daoInfo.token?.address, detail.blkHeight)
  const myDaoBalanceAt = useMemo(() => {
    if (!balanceOfAt || !daoInfo.token) return undefined
    return new TokenAmount(daoInfo.token, balanceOfAt)
  }, [balanceOfAt, daoInfo.token])
  const { account } = useActiveWeb3React()

  const votingOptions = useVotingOptionsById(daoInfo.votingAddress, detail.id)
  const votingOptionsStatus = useMemo(() => {
    let total = '0'
    const list = votingOptions.map(item => {
      const _amount = daoInfo.token ? new TokenAmount(daoInfo.token, item.amount) : undefined
      total = JSBI.add(JSBI.BigInt(total), JSBI.BigInt(item.amount)).toString()
      return {
        name: item.name,
        per: 0,
        votes: _amount
      }
    })
    return {
      list,
      total
    }
  }, [daoInfo.token, votingOptions])
  const votingOptionsList = useMemo(() => {
    const _amount = daoInfo.token ? new TokenAmount(daoInfo.token, votingOptionsStatus.total) : undefined
    return votingOptionsStatus.list.map(item => {
      return {
        name: item.name,
        per: _amount && item.votes && _amount.greaterThan('0') ? Number(item.votes.divide(_amount).toFixed(0)) : 0,
        votes: item.votes?.toSignificant()
      }
    })
  }, [daoInfo.token, votingOptionsStatus.list, votingOptionsStatus.total])

  const isCreator = useMemo(() => {
    return account === detail.creator
  }, [account, detail.creator])

  const { hideModal, showModal } = useModal()

  const onVoteCallback = useCallback(
    (index: number) => {
      showModal(<TransactionPendingModal />)
      voteCallback(detail.id, index)
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
    },
    [detail.id, hideModal, showModal, voteCallback]
  )
  return (
    <div className={styles['proposal-detail-container']}>
      <Button className={styles['btn-back']} onClick={onBack}>
        Back
      </Button>

      <Grid container spacing={24}>
        <Grid item lg={8} xs={12} className={styles['left-part']}>
          {detail.proType === ProposalType.COMMUNITY && (
            <>
              <ProposalContent detail={detail} />
              <ProposalVoteDetail list={votingOptionsList} />
            </>
          )}
          {detail.proType === ProposalType.CONTRACT && (
            <>
              <ExecutableContent />
              <ExecutableVoteResult />
            </>
          )}
        </Grid>
        <Grid item lg={4} xs={12} className={styles['left-part']}>
          {/* {detail.status === ProposalStatusProp.Active && <CastVote />}
          {detail.status !== ProposalStatusProp.Active && <Vote />} */}
          <Vote onVote={onVoteCallback} list={votingOptionsList} balanceAt={myDaoBalanceAt?.toSignificant()} />
          {isCreator ? <ProposalUndoClaim detail={detail} daoInfo={daoInfo} /> : <OtherUserDetail detail={detail} />}
        </Grid>
      </Grid>
    </div>
  )
}
