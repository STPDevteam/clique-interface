import '../building/review.pc.less'

import { Button, Collapse } from 'antd'
import IconArrow from '../../assets/images/icon-arrow.svg'
import { ReactComponent as EditIcon } from 'assets/svg/edit_icon.svg'
import { Box, styled, Typography } from '@mui/material'
import { StyledExtraBg } from 'components/styled'
import { useCallback, useMemo } from 'react'
import { toFormatGroup } from 'utils/dao'
import { getPerForAmount } from '../building/function'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useHistory } from 'react-router-dom'
import AlertError from 'components/Alert/index'
import { useCrossGovCreateDaoCallback } from 'hooks/useCrossGovCreateDaoCallback'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCrossBuildingDataCallback, useCrossCommitCreateDaoData } from 'state/crossBuilding/hooks'
import { useTokenByChain } from 'state/wallet/hooks'
import OutlineButton from 'components/Button/OutlineButton'

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

export default function ReviewInformation({
  goToStep,
  goBack
}: {
  goBack: () => void
  goToStep: (e: 'Basic' | 'Governance' | 'Review') => void
}) {
  const { removeBuildingDaoData } = useCrossBuildingDataCallback()
  const { showModal, hideModal } = useModal()
  const history = useHistory()
  const createDaoCallback = useCrossGovCreateDaoCallback()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { basicData, ruleData } = useCrossCommitCreateDaoData()
  const crossTokenInfo = useTokenByChain(basicData.contractAddress, basicData.baseChainId)

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
            header="DAO Basic Information"
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
                  <span className="value">{crossTokenInfo?.token?.name}</span>
                </div>
                <div className="input-item">
                  <span className="label">Symbol</span>
                  <span className="value">{crossTokenInfo?.token?.symbol}</span>
                </div>
                <div className="input-item">
                  <span className="label">Total Supply</span>
                  <span className="value">
                    {crossTokenInfo?.totalSupply?.toSignificant(6, { groupSeparator: ',' })}
                  </span>
                </div>
              </Box>
              <div className="input-item">
                <span className="label">{basicData.daoName}</span>
                <span className="value">{basicData.description}</span>
              </div>
            </section>
          </Panel>

          <Panel
            header="Governance"
            key="3"
            extra={
              <StyledExtraBg onClick={() => goToStep('Governance')}>
                <EditIcon />
              </StyledExtraBg>
            }
          >
            <section className="panel-rule">
              <Box className="box">
                <Box>
                  <div className="input-item">
                    <span className="label">Minimum holding to vote</span>
                    <span className="value">{toFormatGroup(ruleData.minVoteNumber, 0)}</span>
                    {/* <span className="label">
                  ({getPerForAmount(basicData.tokenSupply, ruleData.minVoteNumber)}% per total supply)
                </span> */}
                  </div>

                  <div className="input-item mt-12">
                    <span className="label">Minimum total votes</span>
                    <span className="value">{toFormatGroup(ruleData.minApprovalNumber, 0)}</span>
                    <span className="label">
                      (
                      {crossTokenInfo?.totalSupply
                        ? getPerForAmount(crossTokenInfo?.totalSupply.toSignificant(), ruleData.minApprovalNumber)
                        : '- '}
                      % per total votes)
                    </span>
                  </div>

                  <div className="input-item mt-12" rules-agreement>
                    <span className="label">Contract Voting Duration</span>
                    <Typography variant="h6">
                      {ruleData.contractDays} Days {ruleData.contractHours} Hours {ruleData.contractMinutes} Minutes
                    </Typography>
                  </div>
                </Box>
                <Box>
                  <div className="input-item">
                    <span className="label">Minimum holding to create proposal</span>
                    <span className="value">{toFormatGroup(ruleData.minCreateProposalNumber, 0)}</span>
                    <span className="label">
                      (
                      {crossTokenInfo?.totalSupply
                        ? getPerForAmount(crossTokenInfo?.totalSupply.toSignificant(), ruleData.minCreateProposalNumber)
                        : '- '}
                      % per total votes)
                    </span>
                  </div>
                  <div className="input-item mt-12">
                    <span className="label">Community Voting Duration</span>
                    <Typography variant="h6">
                      {ruleData.votersCustom
                        ? 'Voters custom'
                        : `${ruleData.days} Days ${ruleData.hours} Hours ${ruleData.minutes} Minutes`}
                    </Typography>
                  </div>
                </Box>
              </Box>
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
      <Box className="btn-group" display={'flex'} justifyContent={'space-between'}>
        <OutlineButton width={'120px'} onClick={goBack}>
          Back
        </OutlineButton>
        <Button style={{ width: 'auto' }} className="btn-common btn-01" disabled={!!createCheck} onClick={onCreate}>
          Confirm and create DAO
        </Button>
        <Box width={120} />
      </Box>
    </>
  )
}
