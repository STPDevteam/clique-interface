import './pc.less'

import { Button } from 'antd'
import IconLink from '../../../../assets/images/icon-link.svg'
import IconLogo from '../../../../assets/images/icon-token.svg'
import { WithdrawAssets, DepositAssets } from '../../../../components/ModalSTP'
import { Box } from '@mui/material'
import useModal from 'hooks/useModal'

export default function Assets() {
  const { showModal } = useModal()

  return (
    <section className="assets">
      <div className="header">
        <h3>Assets</h3>
        <div className="actions">
          <Button onClick={() => showModal(<DepositAssets />)}>Deposit</Button>
          <Button onClick={() => showModal(<WithdrawAssets />)}>Withdraw</Button>
        </div>
      </div>
      <Box display={'flex'} gap="20px" className="transactions">
        <div className="history-list">
          {[1, 2].map((item, index) => (
            <div key={index} className="history-item">
              <div className="left">
                <span>Deposit this token</span>
                <span>2021-11-11 01:07:02</span>
              </div>
              <div className="right">
                <div className="amount">
                  <span>STPT</span>
                  <span>+1000,0000,000</span>
                </div>
                <a className="link">
                  <img src={IconLink} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="dao-tokens">
          <h3>DAO Tokens</h3>
          {[1, 2].map(item => (
            <div key={item} className="token">
              <img className="icon" src={IconLogo} />
              <span className="name">STPT</span>
              <span className="number">14,000</span>
            </div>
          ))}
        </div>
      </Box>
    </section>
  )
}
