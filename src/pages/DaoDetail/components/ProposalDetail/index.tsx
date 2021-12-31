import styles from './index.module.less'
import { Button } from 'antd'
import ProposalContent from '../../../../components/Proposal/ProposalContent'
import ProposalVoteDetail from '../../../../components/Proposal/ProposalVoteDetail'
import CastVote from '../../../../components/Proposal/CastVote'
import ProposalUndoClaim from '../../../../components/Proposal/ProposalUndoClaim'
import OtherUserDetail from '../../../../components/Proposal/OtherUserDetail'
import ExecutableContent from '../../../../components/Proposal/ExecutableContent'
import ExecutableVoteResult from '../../../../components/Proposal/ExecutableVoteResult'
import Vote from '../../../../components/Proposal/Vote'
import { Grid } from '@mui/material'

export default function Index({ detail, onBack }: { detail: any; onBack: any }) {
  return (
    <div className={styles['proposal-detail-container']}>
      <Button className={styles['btn-back']} onClick={onBack}>
        Back
      </Button>

      <Grid container spacing={24}>
        <Grid item lg={8} xs={12} className={styles['left-part']}>
          {detail.status !== 'Executable' && (
            <>
              <ProposalContent detail={detail} />
              <ProposalVoteDetail detail={detail} />
            </>
          )}
          {detail.status === 'Executable' && (
            <>
              <ExecutableContent />
              <ExecutableVoteResult />
            </>
          )}
        </Grid>
        <Grid item lg={4} xs={12} className={styles['left-part']}>
          {detail.status === 'Open' && <CastVote />}
          {detail.status === 'Executable' && <Vote />}
          <ProposalUndoClaim />
          <OtherUserDetail />
        </Grid>
      </Grid>
    </div>
  )
}
