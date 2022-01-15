import './review.pc.less'

import { Button, Collapse, Table } from 'antd'
import IconArrow from '../../assets/images/icon-arrow.svg'
import IconToken from '../../assets/images/icon-token.svg'
import { ReactComponent as EditIcon } from 'assets/svg/edit_icon.svg'
import { Box, styled, Typography } from '@mui/material'
import { StyledExtraBg } from 'components/styled'
import {
  useBuildingDataCallback,
  useCurrentReceivingToken,
  useCurrentUsedTokenAmount,
  useTrueCommitCreateDaoData
} from 'state/building/hooks'
import { useCallback, useMemo } from 'react'
import { timeStampToFormat, toFormatGroup, toFormatMillion } from 'utils/dao'
import { calcTotalAmountValue, getPerForAmount } from './function'
import { shortenAddress } from 'utils'
import TextArea from 'antd/lib/input/TextArea'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useHistory } from 'react-router-dom'
import AlertError from 'components/Alert/index'
import { useCreateDaoCallback } from 'hooks/useCreateDaoCallback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import Image from 'components/Image'

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
  goToStep
}: {
  goToStep: (e: 'Basic' | 'Distribution' | 'Rule' | 'Review') => void
}) {
  const { removeBuildingDaoData } = useBuildingDataCallback()
  const { showModal, hideModal } = useModal()
  const history = useHistory()
  const currentUsedTokenAmount = useCurrentUsedTokenAmount()
  const createDaoCallback = useCreateDaoCallback()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { basicData, distributionData, ruleData } = useTrueCommitCreateDaoData()

  const reservedTokensData = useMemo(() => {
    return distributionData.reservedTokens.map((item, index) => ({
      id: index + 1,
      address: (item.address && shortenAddress(item.address)) || '',
      amount: toFormatMillion(item.tokenNumber || '') + ' ' + basicData.tokenSymbol,
      per: getPerForAmount(basicData.tokenSupply, item.tokenNumber || '') + '%',
      lockUntil: timeStampToFormat(item.lockdate)
    }))
  }, [basicData.tokenSupply, basicData.tokenSymbol, distributionData.reservedTokens])

  const privateSaleData = useMemo(() => {
    return distributionData.privateSale.map((item, index) => ({
      id: index + 1,
      address: (item.address && shortenAddress(item.address)) || '',
      amount: toFormatMillion(item.tokenNumber || '') + ' ' + basicData.tokenSymbol,
      per: getPerForAmount(basicData.tokenSupply, item.tokenNumber || '') + '%',
      price: item.price + ' ' + distributionData.privateReceivingToken,
      pledgedOfValue:
        toFormatGroup(calcTotalAmountValue(item.tokenNumber, item.price), 0) +
        ' ' +
        distributionData.privateReceivingToken
    }))
  }, [
    basicData.tokenSupply,
    basicData.tokenSymbol,
    distributionData.privateReceivingToken,
    distributionData.privateSale
  ])

  const currentReceivingToken = useCurrentReceivingToken()

  const onCreate = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    createDaoCallback()
      .then((hash: string) => {
        hideModal()
        removeBuildingDaoData()
        history.push('/building/launching/' + hash)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [createDaoCallback, hideModal, history, removeBuildingDaoData, showModal])

  const createCheck: JSX.Element | string | undefined = useMemo(() => {
    if (!account) {
      return (
        <>
          You need connect wallet{' '}
          <span style={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
            (click connect)
          </span>
        </>
      )
    }
    return undefined
  }, [account, toggleWalletModal])

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
            header="DAO Basic"
            key="1"
            extra={
              <StyledExtraBg onClick={() => goToStep('Basic')}>
                <EditIcon />
              </StyledExtraBg>
            }
          >
            <section className="panel-general">
              <Box display={'grid'} gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap="20px" mb={15}>
                <img className="icon-token" src={IconToken} />
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
              <div className="input-item">
                <span className="label">{basicData.daoName}</span>
                <span className="value">{basicData.description}</span>
              </div>
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
            {distributionData.reservedOpen && (
              <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
                <Box padding={'0 30px'} borderBottom={'0.5px solid #D8D8D8'} paddingBottom={8}>
                  <Typography fontWeight={500}>Reserved Tokens</Typography>
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
                <Box padding={'0 30px'} display={'flex'} justifyContent={'space-between'}>
                  <Typography fontWeight={500}>Reserved amount:</Typography>
                  <Typography>
                    {toFormatGroup(currentUsedTokenAmount.reservedAmount, 0)} {basicData.tokenSymbol} (
                    {getPerForAmount(basicData.tokenSupply, currentUsedTokenAmount.reservedAmount)}%)
                  </Typography>
                </Box>
              </Box>
            )}

            {distributionData.privateSaleOpen && (
              <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
                <Box display={'flex'} justifyContent={'space-between'} padding={'0 30px'}>
                  <Typography fontSize={14} color="#798488" style={{ fontWeight: 400 }}>
                    Receiving Token
                  </Typography>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={5}
                    sx={{
                      '& img, & svg': {
                        width: 20,
                        height: 20
                      }
                    }}
                  >
                    <Image src={currentReceivingToken.logo} />
                    {currentReceivingToken.name}
                  </Box>
                </Box>
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  padding={'0 30px 10px'}
                  borderBottom={'0.5px solid #D8D8D8'}
                  mt={20}
                >
                  <Typography fontWeight={500}>Private sale</Typography>
                </Box>
                <Table className="panel-config stp-table" dataSource={privateSaleData} rowKey={'id'} pagination={false}>
                  <Column title="#" dataIndex="id" key="id" align="center" />
                  <Column align="center" title="Address" dataIndex="address" key="address" />
                  <Column align="center" title="Amount" dataIndex="amount" key="amount" />
                  <Column align="center" title="%" dataIndex="per" key="per" />
                  <Column align="center" title="Price" dataIndex="price" key="price" />
                  <Column title="Pledged of value" dataIndex="pledgedOfValue" key="pledgedOfValue" align="center" />
                </Table>
                <Box display={'flex'} justifyContent={'space-between'} padding={'0 30px'} mt={8}>
                  <Typography>Private sale total</Typography>
                  <Typography>
                    {toFormatGroup(currentUsedTokenAmount.privateSaleTotal, 0)} {basicData.tokenSymbol} (
                    {getPerForAmount(basicData.tokenSupply, currentUsedTokenAmount.privateSaleTotal)}%)
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} padding={'0 30px'} mt={8}>
                  <Typography>Equivalent estimate</Typography>
                  <Typography>
                    {toFormatGroup(currentUsedTokenAmount.privateEquivalentEstimate) +
                      ' ' +
                      distributionData.privateReceivingToken}
                  </Typography>
                </Box>
              </Box>
            )}

            {distributionData.publicSaleOpen && (
              <Box padding={'20px 35px'} width={'100%'}>
                <Box display={'grid'} gap="8px" padding={'0 30px'}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography>Public sale total</Typography>
                    <Typography>
                      {toFormatGroup(currentUsedTokenAmount.publicSaleTotal, 0)} {basicData.tokenSymbol} ({' '}
                      {getPerForAmount(basicData.tokenSupply, currentUsedTokenAmount.publicSaleTotal)}
                      %)
                    </Typography>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography>Price</Typography>
                    <Typography>
                      {distributionData.publicSale.price} {distributionData.privateReceivingToken}
                    </Typography>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography>Pledge limit (optional)</Typography>
                    <Typography>
                      {distributionData.publicSale.pledgeLimitMin
                        ? toFormatGroup(distributionData.publicSale.pledgeLimitMin, 0)
                        : ''}{' '}
                      -{' '}
                      {distributionData.publicSale.pledgeLimitMax
                        ? toFormatGroup(distributionData.publicSale.pledgeLimitMax, 0)
                        : ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            <Box padding={'20px 65px'} width={'100%'} display={'grid'} gap={8}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>Start time: {timeStampToFormat(distributionData.startTime)}</Typography>
                <Typography>End time: {timeStampToFormat(distributionData.endTime)}</Typography>
              </Box>
              <Box className="input-item">
                <TextArea value={distributionData.aboutProduct} disabled rows={5} />
              </Box>
            </Box>
          </Panel>

          <Panel
            header="Rule"
            key="3"
            extra={
              <StyledExtraBg onClick={() => goToStep('Rule')}>
                <EditIcon />
              </StyledExtraBg>
            }
          >
            <section className="panel-rule">
              <div className="input-item">
                <span className="label">Minimum to vote</span>
                <span className="value">{toFormatGroup(ruleData.minVoteNumber, 0)}</span>
                <span className="label">
                  ({getPerForAmount(basicData.tokenSupply, ruleData.minVoteNumber)}% per total supply)
                </span>
              </div>
              <div className="input-item">
                <span className="label">Minimum create proposal</span>
                <span className="value">{toFormatGroup(ruleData.minCreateProposalNumber, 0)}</span>
                <span className="label">
                  ({getPerForAmount(basicData.tokenSupply, ruleData.minCreateProposalNumber)}% per total votes)
                </span>
              </div>
              <div className="input-item mt-12">
                <span className="label">Minimum valid votes</span>
                <span className="value">{toFormatGroup(ruleData.minApprovalNumber, 0)}</span>
                <span className="label">
                  ({getPerForAmount(basicData.tokenSupply, ruleData.minApprovalNumber)}% per total votes)
                </span>
              </div>
              {ruleData.votersCustom ? (
                <>
                  <div className="input-item mt-12 rules-agreement">
                    <span className="label">Contract Executor</span>
                    <Typography fontSize={14} fontWeight={500}>
                      {ruleData.contractExecutor}
                    </Typography>
                  </div>
                  <div className="input-item mt-12 rules-agreement">
                    <span className="label">Contract Voting Duration</span>
                    <Typography fontSize={14} fontWeight={500}>
                      {ruleData.contractDays} Day {ruleData.contractHours} Hour {ruleData.contractMinutes} Minute
                    </Typography>
                  </div>
                </>
              ) : (
                <div className="input-item mt-12 rules-agreement">
                  <span className="label">Community Voting Duration</span>
                  <Typography fontSize={14} fontWeight={500}>
                    {ruleData.days} Day {ruleData.hours} Hour {ruleData.minutes} Minute
                  </Typography>
                </div>
              )}
              <div className="input-item mt-12 rules-agreement">
                <span className="label">Rules/Agreement</span>
                <Typography fontSize={12}>{ruleData.rules}</Typography>
              </div>
            </section>
          </Panel>
        </Collapse>
        {createCheck && (
          <Box mt={15}>
            <AlertError>{createCheck}</AlertError>
          </Box>
        )}
      </Wrapper>
      <Box className="btn-group" display={'flex'} justifyContent={'center'}>
        <Button style={{ width: 'auto' }} className="btn-common btn-01" disabled={!!createCheck} onClick={onCreate}>
          I have confirmed and created the DAO
        </Button>
      </Box>
    </>
  )
}
