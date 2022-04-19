import { Box, styled, Typography } from '@mui/material'
import { Table } from 'antd'
import OutlineButton from 'components/Button/OutlineButton'
import Image from 'components/Image'
import { ReactComponent as OpenGarpLink } from 'assets/svg/open-gary-link.svg'
import Button from 'components/Button/Button'
import { isAddress, shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import PublishModal from './PublishModal'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import { MyAirdropResProp, useMyAirdropList } from 'hooks/staking/useServerData'
import { useMemo } from 'react'
import { ExternalLink } from 'theme/components'
import { timeStampToFormat, toFormatGroup } from 'utils/dao'
import Copy from 'components/essential/Copy'
import Pagination from 'antd/lib/pagination'
import { useActiveWeb3React } from 'hooks'
import { useAirdropClaimed } from 'hooks/staking/useAirdropinfo'
import { TokenAmount } from 'constants/token'
import { useTagCompletedTx } from 'state/transactions/hooks'

const Main = styled('main')({
  display: 'flex',
  justifyContent: 'center',
  padding: '48px 20px'
})
const Container = styled(Box)({
  width: '100%',
  maxWidth: 967
})

const TableText = styled(Typography)({
  color: '#22304A',
  fontSize: 16,
  fontWeight: 500
})

const { Column } = Table

export default function Create() {
  const { showModal } = useModal()
  const { list, page, reload, loading } = useMyAirdropList()
  const { account } = useActiveWeb3React()

  const airdropList: any[] = useMemo(() => {
    return list.map(item => ({
      id: item.id,
      token: (
        <Box display={'flex'} alignItems="center" gap="2px" justifyContent={'center'}>
          <Image width={'24px'} height="24px" src={item.tokenLogo} />
          <TableText>{item.token?.symbol || '--'}</TableText>
          {item.mediumLink && (
            <ExternalLink href={item.mediumLink}>
              <OpenGarpLink width={16} height={16} />
            </ExternalLink>
          )}
        </Box>
      ),
      contractAddress: (
        <Box display={'flex'} alignItems="center">
          <TableText>
            {isAddress(item.tokenContractAddress) ? shortenAddress(item.tokenContractAddress) : '--'}
          </TableText>
          {isAddress(item.tokenContractAddress) && <Copy toCopy={item.tokenContractAddress} />}
        </Box>
      ),
      amount: <TableText>{toFormatGroup(item.airdropAmount)}</TableText>,
      claimed: item.status === 'onChain' && item.airdropId ? <ClaimTotal item={item} /> : '--',
      startTime: <TableText>{timeStampToFormat(item.airdropTime)}</TableText>,
      operation: (
        <Box display={'flex'} gap="5px">
          <Button
            onClick={() => showModal(<EditModal item={item} reloadList={reload} />)}
            height="24px"
            width="60px"
            style={{ borderRadius: '4px', fontSize: 12 }}
          >
            Edit
          </Button>
          {item.creatorAddress === account && item.status === 'offChain' && (
            <PublishButton id={item.id} event={() => showModal(<PublishModal item={item} />)}></PublishButton>
          )}
        </Box>
      )
    }))
  }, [account, list, reload, showModal])

  return (
    <Box>
      <Main>
        <Container>
          <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
            <Typography fontSize={'24px'} variant="h5" fontWeight={600}>
              Project
            </Typography>
            <OutlineButton width={'140px'} height="40px" onClick={() => showModal(<CreateModal reloadList={reload} />)}>
              Create project
            </OutlineButton>
          </Box>
          <Table
            className="panel-config stp-table"
            loading={loading}
            dataSource={airdropList}
            rowKey={'id'}
            pagination={false}
          >
            <Column title="ID" dataIndex="id" key="id" align="center" />
            <Column title="Token" dataIndex="token" key="token" align="center" />
            <Column align="center" title="Contract Address" dataIndex="contractAddress" key="contractAddress" />
            <Column align="center" title="Amount" dataIndex="amount" key="amount" />
            <Column align="center" title="Claimed" dataIndex="claimed" key="claimed" />
            <Column title="Airdrop time(estimate)" dataIndex="startTime" key="startTime" align="center" />
            <Column title="Operation" dataIndex="operation" key="operation" align="center" />
          </Table>
          <Box display={'flex'} justifyContent="center">
            <Pagination
              simple
              size="default"
              hideOnSinglePage
              pageSize={page.pageSize}
              style={{ marginTop: 20 }}
              current={page.currentPage}
              total={page.total}
              onChange={e => page.setCurrentPage(e)}
            />
          </Box>
        </Container>
      </Main>
    </Box>
  )
}

function ClaimTotal({ item }: { item: MyAirdropResProp }) {
  const { result } = useAirdropClaimed(item.airdropId)
  const amount = useMemo(() => {
    if (!result || !item.token) return undefined
    return new TokenAmount(item.token, result)
  }, [result, item.token])
  return <TableText>{amount?.toSignificant(6, { groupSeparator: ',' }) || '-'}</TableText>
}

function PublishButton({ id, event }: { id: number; event: () => void }) {
  const isPublishing = useTagCompletedTx('airdropPublish', '', id)

  return (
    <Button
      disabled={isPublishing}
      onClick={event}
      height="24px"
      width="60px"
      style={{ borderRadius: '4px', fontSize: 12 }}
    >
      publish
    </Button>
  )
}
