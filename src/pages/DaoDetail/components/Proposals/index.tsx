import { useMemo, useState } from 'react'
import { Tabs, Button, Tooltip } from 'antd'
import styles from './index.module.less'
const { TabPane } = Tabs
import ProposalStatus from '../../../../components/Proposal/ProposalStatus'
import { Box } from '@mui/material'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { toFormatGroup } from 'utils/dao'

interface IProps {
  onSelect: (proposal: any) => void
  onCreate: () => void
  daoInfo: DaoInfoProps | undefined
}
export default function(props: IProps) {
  const { onSelect, onCreate, daoInfo } = props
  const { account } = useActiveWeb3React()
  const TABS = ['ALL', 'Executable', 'Open', 'Closed']
  const [currentTab, setCurrentTab] = useState(TABS[0])
  const tokenBalance = useTokenBalance(account || undefined, daoInfo?.token)
  const isProposal = useMemo(() => {
    if (!tokenBalance || !daoInfo?.rule?.minimumCreateProposal) return false
    if (tokenBalance?.lessThan(daoInfo?.rule?.minimumCreateProposal)) return false
    return true
  }, [daoInfo?.rule?.minimumCreateProposal, tokenBalance])

  const proposals = [
    {
      name: 'Parameter Changes Proposal',
      desc: 'A law is currently looming on the horizon that xxxxxxx',
      status: 'Open',
      startTime: '2021-11-11 01:07:02'
    },
    {
      name: 'Parameter Changes Proposal',
      desc: 'A law is currently looming on the horizon that ...',
      status: 'Soon',
      startTime: '2021-11-11 01:07:02'
    },
    {
      name: 'Parameter Changes Proposal',
      desc: 'A law is currently looming on the horizon that ...',
      status: 'Closed',
      startTime: '2021-11-11 01:07:02'
    },
    {
      name: 'Parameter Changes Proposal',
      desc: 'A law is currently looming on the horizon that ...',
      status: 'Executable',
      startTime: '2021-11-11 01:07:02'
    }
  ]

  return (
    <div className={styles['proposals-container']}>
      <div className={styles['header']}>
        <div className={styles['header-info']}>
          <p className={styles['title']}>Proposal</p>
          <p className={styles['text']}>
            Community proposals are a great way to see how the community feels about your ideas
          </p>
        </div>
        <Tooltip
          placement="top"
          title={`Minimum create proposal: ${
            daoInfo?.rule?.minimumCreateProposal
              ? toFormatGroup(daoInfo?.rule?.minimumCreateProposal.toSignificant(), 0)
              : '-'
          } ${daoInfo?.token?.symbol}`}
        >
          <Button
            disabled={!isProposal && false}
            style={{ width: 190, height: 48 }}
            className={'btn-common btn-01'}
            onClick={onCreate}
          >
            Create A Proposal
          </Button>
        </Tooltip>
      </div>

      <Tabs
        defaultActiveKey={currentTab}
        onChange={key => {
          setCurrentTab(key)
        }}
        className={styles['custom-tabs']}
      >
        {TABS.map(tab => (
          <TabPane tab={tab} key={tab}></TabPane>
        ))}
      </Tabs>

      <Box display={'flex'} gap="32px" flexWrap={'wrap'} className={styles['proposals-list']}>
        {proposals.map((item, index) => (
          <div key={index} className={styles['proposals-item']} onClick={() => onSelect(item)}>
            <p className={styles['title']}>{item.name}</p>
            <p className={styles['desc']}>{item.desc}</p>
            <div className={styles['footer']}>
              <ProposalStatus status={item.status} />
              <p className={styles['start-time']}>
                {item.status === 'Closed' ? 'Ended at ' : 'Start at '} {item.startTime}
              </p>
            </div>
          </div>
        ))}
      </Box>
    </div>
  )
}
