import '../building/review.pc.less'

import { Button, Collapse, Table } from 'antd'
import IconArrow from '../../assets/images/icon-arrow.svg'
import { ReactComponent as EditIcon } from 'assets/svg/edit_icon.svg'
import { Box, styled, Typography } from '@mui/material'
import { StyledExtraBg } from 'components/styled'
import { useTrueCreateTokenData, useCreateTokenDataCallback } from 'state/createToken/hooks'
import { useCallback, useMemo } from 'react'
import { timeStampToFormat, toFormatGroup } from 'utils/dao'
import { getPerForAmount } from '../building/function'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useHistory } from 'react-router-dom'
import AlertError from 'components/Alert/index'
import { useCreateERC20Callback } from 'hooks/useCreateERC20Callback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import OutlineButton from 'components/Button/OutlineButton'
import { ChainListMap } from 'constants/chain'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { SUPPORT_CREATE_TOKEN_NETWORK } from '../../constants'

const Wrapper = styled('section')({
  '& p': {
    fontSize: 16,
    fontWeight: 500
  },
  '& .ant-collapse-content': {
    color: '#22304A'
  }
})

const { Panel } = Collapse
const { Column } = Table

export default function ReviewInformation({
  goToStep,
  goBack
}: {
  goBack: () => void
  goToStep: (e: 'Basic' | 'Distribution' | 'Review') => void
}) {
  const { removeCreateTokenDataCallback } = useCreateTokenDataCallback()
  const { showModal, hideModal } = useModal()
  const history = useHistory()
  const createERC20 = useCreateERC20Callback()
  const { account, library, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { basicData, distributionData } = useTrueCreateTokenData()

  const reservedTokensData = useMemo(() => {
    return distributionData.map((item, index) => ({
      id: index + 1,
      address: (item.address && shortenAddress(item.address)) || '',
      amount: toFormatGroup(item.tokenNumber || '') + ' ' + basicData.tokenSymbol,
      per: getPerForAmount(basicData.tokenSupply, item.tokenNumber || '') + '%',
      lockUntil: timeStampToFormat(item.lockDate)
    }))
  }, [basicData.tokenSupply, basicData.tokenSymbol, distributionData])

  const onCreate = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    createERC20()
      .then((hash: string) => {
        hideModal()
        removeCreateTokenDataCallback()
        history.push('/create_token/launching/' + hash)
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
  }, [createERC20, hideModal, history, removeCreateTokenDataCallback, showModal])

  const createCheck: JSX.Element | string | undefined = useMemo(() => {
    if (!account || !library || !chainId) {
      return (
        <>
          You need connect wallet{' '}
          <span style={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
            (click connect)
          </span>
        </>
      )
    }
    if (chainId !== basicData.baseChainId) {
      return (
        <>
          You need connect to {basicData.baseChainId && ChainListMap[basicData.baseChainId].name}
          <span
            style={{ cursor: 'pointer' }}
            onClick={() =>
              triggerSwitchChain(library, basicData.baseChainId || SUPPORT_CREATE_TOKEN_NETWORK[0], account)
            }
          >
            (Click to switch)
          </span>
        </>
      )
    }
    return undefined
  }, [account, basicData.baseChainId, chainId, library, toggleWalletModal])

  return (
    <>
      <Wrapper className="review">
        <Collapse
          expandIcon={({ isActive }) => (
            <span className="icon-wrapper">
              <img
                src={IconArrow}
                style={{
                  transform: `rotate(${isActive ? 180 : 0}deg)`
                }}
              />
            </span>
          )}
          className="collapse-common"
          defaultActiveKey={['1', '2', '3']}
        >
          <Panel
            header="Token Basic Information"
            key="1"
            extra={
              <StyledExtraBg onClick={() => goToStep('Basic')}>
                <EditIcon />
              </StyledExtraBg>
            }
          >
            <section className="panel-general">
              <Box display={'grid'} gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap="20px" mb={15}>
                <img className="icon-token" src={basicData.tokenPhoto} />
                <div className="input-item">
                  <span className="label">Token Name</span>
                  <span className="value">{basicData.tokenName}</span>
                </div>
                <div className="input-item">
                  <span className="label">Symbol</span>
                  <span className="value">{basicData.tokenSymbol}</span>
                </div>
                <div className="input-item">
                  <span className="label">Total Supply</span>
                  <span className="value">{toFormatGroup(basicData.tokenSupply, 0)}</span>
                </div>
              </Box>
              <Box display={'grid'} gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap="20px" mb={15}>
                <div className="input-item">
                  <span className="label">Blockchain</span>
                  <span className="value">{basicData.baseChainId && ChainListMap[basicData.baseChainId].name}</span>
                </div>
                <div className="input-item">
                  <span className="label">Total Decimals</span>
                  <span className="value">{basicData.tokenDecimals}</span>
                </div>
              </Box>
            </section>
          </Panel>

          <Panel
            header="Distribution"
            key="2"
            extra={
              <StyledExtraBg onClick={() => goToStep('Distribution')}>
                <EditIcon />
              </StyledExtraBg>
            }
          >
            {distributionData && (
              <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
                <Box padding={'0 30px'} borderBottom={'0.5px solid #D8D8D8'} paddingBottom={8}>
                  <Typography variant="h6">Reserved Tokens</Typography>
                </Box>
                <Table
                  className="panel-config stp-table"
                  dataSource={reservedTokensData}
                  rowKey={'id'}
                  pagination={false}
                >
                  <Column title="#" dataIndex="id" key="id" align="center" />
                  <Column align="center" title="Address" dataIndex="address" key="address" />
                  <Column align="center" title="Amount" dataIndex="amount" key="amount" />
                  <Column align="center" title="%" dataIndex="per" key="per" />
                  <Column title="Lock until" dataIndex="lockUntil" key="lockUntil" align="center" />
                </Table>
              </Box>
            )}
          </Panel>
        </Collapse>
        {createCheck && (
          <Box mt={15}>
            <AlertError>{createCheck}</AlertError>
          </Box>
        )}
      </Wrapper>
      <Box className="btn-group" display={'flex'} justifyContent="space-between">
        <OutlineButton width={'120px'} onClick={goBack}>
          Back
        </OutlineButton>
        <Button style={{ width: 'auto' }} className="btn-common btn-01" disabled={!!createCheck} onClick={onCreate}>
          Create token
        </Button>
        <Box width="120px" />
      </Box>
    </>
  )
}
