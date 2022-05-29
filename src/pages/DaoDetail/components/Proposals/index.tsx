import { useMemo, useState } from 'react'
import { Tabs, Tooltip, Pagination, Spin, Empty } from 'antd'
import styles from './index.module.less'
const { TabPane } = Tabs
import ProposalStatus from '../../../../components/Proposal/ProposalStatus'
import { Box, Grid } from '@mui/material'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { timeStampToFormat, toFormatGroup } from 'utils/dao'
import { ProposalInfoProp, useProposalList } from 'hooks/useVoting'
import { ProposalStatusProp } from 'hooks/useCreateCommunityProposalCallback'
import Button from 'components/Button/Button'

interface IProps {
  onSelect: (proposal: ProposalInfoProp) => void
  onCreate: () => void
  daoInfo: DaoInfoProps | undefined
}
export default function Index(props: IProps) {
  const { onSelect, onCreate, daoInfo } = props
  const { account } = useActiveWeb3React()
  const TABS = ['ALL']
  // const TABS = ['ALL', 'Executable', 'Open', 'Closed']
  const [currentTab, setCurrentTab] = useState(TABS[0])
  const { list: proposalList, page: proposalListPage, loading: proposalListLoading } = useProposalList(
    daoInfo?.votingAddress
  )

  const tokenBalance = useTokenBalance(account || undefined, daoInfo?.token)
  const isCreateAble = useMemo(() => {
    if (!tokenBalance || !daoInfo?.rule?.minimumCreateProposal) return false
    if (tokenBalance?.lessThan(daoInfo?.rule?.minimumCreateProposal)) return false
    return true
  }, [daoInfo?.rule?.minimumCreateProposal, tokenBalance])

  return (
    <div className={styles['proposals-container']}>
      <Box className={styles['header']} justifyContent={'space-between'} display={'flex'} flexWrap={'wrap'} gap={10}>
        <div className={styles['header-info']}>
          <p className={styles['title']}>Proposal</p>
          {/* <p className={styles['text']}>
            Community proposals are a great way to see how the community feels about your ideas
          </p> */}
        </div>
        <Tooltip
          placement="top"
          title={`Minimum create proposal: ${
            daoInfo?.rule?.minimumCreateProposal
              ? toFormatGroup(daoInfo?.rule?.minimumCreateProposal.toSignificant(), 0)
              : '-'
          } ${daoInfo?.token?.symbol}`}
        >
          <Button style={{ width: 190, height: 48 }} disabled={!isCreateAble} onClick={onCreate}>
            Create A Proposal
          </Button>
        </Tooltip>
      </Box>

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

      {proposalListLoading && (
        <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={30}>
          <Spin size="large" tip="Loading..." />
        </Box>
      )}
      {!proposalListLoading && proposalList.length === 0 && (
        <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={30}>
          <Empty description="No proposals currently" />
        </Box>
      )}
      <Grid container className={styles['proposals-list']} spacing={30}>
        {!proposalListLoading &&
          proposalList.map(
            (item, index) =>
              item && (
                <Grid item md={12} lg={6} key={index}>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    className={styles['proposals-item']}
                    onClick={() => onSelect(item)}
                  >
                    <Box>
                      <p className={styles['title']}>{item.title}</p>
                      <p className={styles['desc']} dangerouslySetInnerHTML={{ __html: item.content }}></p>
                    </Box>
                    <div className={styles['footer']}>
                      <ProposalStatus status={item.status} />
                      <p className={styles['start-time']}>
                        {item.status === ProposalStatusProp.Review
                          ? `Start at ${timeStampToFormat(item.startTime)}`
                          : `Ended at ${timeStampToFormat(item.endTime)}`}
                      </p>
                    </div>
                  </Box>
                </Grid>
              )
          )}
      </Grid>
      <Box display={'flex'} justifyContent={'center'}>
        <Pagination
          simple
          size="default"
          hideOnSinglePage
          pageSize={proposalListPage.pageSize}
          style={{ marginTop: 20 }}
          current={proposalListPage.currentPage}
          total={proposalListPage.total}
          onChange={e => proposalListPage.setCurrentPage(e)}
        />
      </Box>
    </div>
  )
}
