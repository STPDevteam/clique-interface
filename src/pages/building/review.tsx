import './review.pc.less'

import { Collapse, Table } from 'antd'
import IconArrow from '../../assets/images/icon-arrow.svg'
import IconToken from '../../assets/images/icon-token.svg'
import { ReactComponent as EditIcon } from 'assets/svg/edit_icon.svg'
import { Box, Typography } from '@mui/material'
import { StyledExtraBg } from 'components/styled'
import { useBuildingData } from 'state/building/hooks'
import { useMemo } from 'react'
import { getPerForAmount, timeStampToFormat } from 'utils/dao'

const { Panel } = Collapse
const { Column } = Table

export default function ReviewInformation({
  goToStep
}: {
  goToStep: (e: 'Basic' | 'Distribution' | 'Rule' | 'Review') => void
}) {
  const { buildingDaoData } = useBuildingData()
  const { basic, distribution } = buildingDaoData

  const reservedTokensData = useMemo(() => {
    return distribution.reservedTokens.map((item, index) => ({
      id: index + 1,
      address: item.address,
      amount: item.tokenNumber,
      per: getPerForAmount(basic.tokenSupply, item.tokenNumber || '') + '%',
      lockUntil: timeStampToFormat(item.lockdate)
    }))
  }, [basic.tokenSupply, distribution.reservedTokens])

  const privateSaleData = useMemo(() => {
    return distribution.privateSale.map((item, index) => ({
      id: index + 1,
      address: item.address,
      amount: item.tokenNumber,
      per: getPerForAmount(basic.tokenSupply, item.tokenNumber || '') + '%',
      price: '$'
    }))
  }, [basic.tokenSupply, distribution.privateSale])

  return (
    <section className="review">
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
                <span className="value">{basic.tokenName}</span>
              </div>
              <div className="input-item">
                <span className="label">Symbol</span>
                <span className="value">{basic.tokenSymbol}</span>
              </div>
              <div className="input-item">
                <span className="label">Total Supply</span>
                <span className="value">{basic.tokenSupply}</span>
              </div>
            </Box>
            <div className="input-item">
              <span className="label">{basic.daoName}</span>
              <span className="value">{basic.description}</span>
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
          <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              padding={'0 30px'}
              borderBottom={'0.5px solid #D8D8D8'}
            >
              <Typography>Reserved Tokens</Typography>
              <Box display={'flex'} paddingBottom={8}>
                <Typography>Reserved amount:</Typography>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  50,000,000 (50%)
                </Typography>
              </Box>
            </Box>
            <Table className="panel-config stp-table" dataSource={reservedTokensData} rowKey={'id'} pagination={false}>
              <Column title="#" dataIndex="id" key="id" align="center" />
              <Column align="center" title="Address" dataIndex="address" key="address" />
              <Column align="center" title="Amount" dataIndex="amount" key="amount" />
              <Column align="center" title="%" dataIndex="per" key="per" />
              <Column title="Lock until" dataIndex="lockUntil" key="lockUntil" align="center" />
            </Table>
          </Box>

          <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              padding={'0 30px'}
              borderBottom={'0.5px solid #D8D8D8'}
            >
              <Typography>Private sale</Typography>
              <Box display={'flex'} paddingBottom={8}>
                <Typography>Private sale total:</Typography>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  10,000,000
                </Typography>
              </Box>
            </Box>
            <Table className="panel-config stp-table" dataSource={privateSaleData} rowKey={'id'} pagination={false}>
              <Column title="#" dataIndex="id" key="id" align="center" />
              <Column align="center" title="Address" dataIndex="address" key="address" />
              <Column align="center" title="Amount" dataIndex="amount" key="amount" />
              <Column align="center" title="%" dataIndex="per" key="per" />
              <Column title="Pledged of value" dataIndex="price" key="price" align="center" />
            </Table>
            <Box display={'flex'} justifyContent={'space-between'} padding={'0 30px'} mt={8}>
              <Typography>Target completion amount</Typography>
              <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                10,000,000
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} padding={'0 30px'} mt={8}>
              <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                Start time: 2021-12-16 19:10:39
              </Typography>
              <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                End time: 2021-12-16 19:10:39
              </Typography>
            </Box>
          </Box>

          <Box padding={'20px 35px'} borderBottom={'0.5px solid #D8D8D8'} width={'100%'}>
            <Box display={'grid'} gap="8px" padding={'0 30px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>Public sale</Typography>
                <Box display={'flex'}>
                  <Typography>Public sale total:</Typography>
                  <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                    {distribution.publicSale.offeringAmount}
                  </Typography>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>Target completion amount</Typography>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  10,000,000
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography>Pledge limit (optional)</Typography>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  {distribution.publicSale.pledgeLimitMin} - {distribution.publicSale.pledgeLimitMax}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  Start time: {timeStampToFormat(distribution.publicSale.startTime)}
                </Typography>
                <Typography fontSize={16} fontWeight={500} color={'#22304A'}>
                  End time: {timeStampToFormat(distribution.publicSale.endTime)}
                </Typography>
              </Box>
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
              <span className="value">Minimum to vote</span>
            </div>
            <div className="input-item">
              <span className="label">Minimum create proposal</span>
              <span className="value">Minimum to vote</span>
            </div>
            <div className="input-item">
              <span className="label">(50% per total supply)</span>
            </div>
            <div className="input-item">
              <span className="label">(30% per total votes)</span>
            </div>
            <div className="input-item mt-12">
              <span className="label">Minimum approval percentage</span>
              <span className="value">80,000</span>
            </div>
            <div className="input-item mt-12">
              <span className="label">Voting Duration</span>
              <span className="value">Voters custom</span>
            </div>
            <div className="input-item mt-12 rules-agreement">
              <span className="label">Contract Executor</span>
              <Typography fontSize={14} fontWeight={500}>
                0xd97dA63d086d222EDE0aa8ee8432031465EEF
              </Typography>
            </div>
            <div className="input-item mt-12 rules-agreement">
              <span className="label">Contract Voting Duration</span>
              <Typography fontSize={14} fontWeight={500}>
                1 Days 24:00:00
              </Typography>
            </div>
            <div className="input-item mt-12 rules-agreement">
              <span className="label">Rules/Agreement</span>
              <Typography fontSize={12}>
                Any transaction created in this DAO must have first been proposed in STP vote and with the following
                approval criteria:67% support of the participating tokens in the vote proposal duration of at least 3
                days. Transactions created that do not meet the above criteria should not be permitted.
              </Typography>
            </div>
          </section>
        </Panel>
      </Collapse>
    </section>
  )
}
