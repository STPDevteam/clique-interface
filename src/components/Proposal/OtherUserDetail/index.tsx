import { Link } from '@mui/material'
import { CROSS_SUPPORT_IMPORT_NETWORK } from '../../../constants'
import { useActiveWeb3React } from 'hooks'
import { ProposalInfoProp } from 'hooks/useVoting'
import { getEtherscanLink, shortenAddress } from 'utils'
import { timeStampToFormat } from 'utils/dao'
import styles from './index.module.less'
import { ReactComponent as OpenLink } from 'assets/svg/open-gary-link.svg'

export default function Index({ detail, snapshot }: { detail: ProposalInfoProp; snapshot?: string }) {
  const { chainId } = useActiveWeb3React()
  return (
    <div className={styles['other-user-container']}>
      {/* <p className={styles['out-title']}>Other user:</p> */}
      <div className={styles['other-user-detail']}>
        <p className={styles['title']}>Other user details:</p>
        <div className={styles['list-item']}>
          <span className={styles['label']}>Initiator</span>
          <span className={styles['value']}>{shortenAddress(detail.creator)}</span>
        </div>
        <div className={styles['list-item']}>
          <span className={styles['label']}>Snapshot</span>
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
      </div>
    </div>
  )
}
