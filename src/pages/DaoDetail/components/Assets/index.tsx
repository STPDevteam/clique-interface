import './pc.less'

import { Button } from 'antd'
import IconLink from '../../../../assets/images/icon-link.svg'
import IconLogo from '../../../../assets/images/icon-token.svg'
import { WithdrawAssets, DepositAssets } from '../../../../components/ModalSTP'
import { Box } from '@mui/material'
import useModal from 'hooks/useModal'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { privateReceivingTokens } from 'state/building/hooks'
import { useCallback, useMemo } from 'react'
import { Token } from 'constants/token'
import Image from 'components/Image'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTokenTransferCallback } from 'hooks/useTokenTransferCallback'
import { useCreateContractProposalCallback } from 'hooks/useCreateContractProposalCallback'

export default function Assets({ daoInfo }: { daoInfo: DaoInfoProps }) {
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()

  const daoTokens = useMemo(() => {
    const ret = privateReceivingTokens.map(
      item => new Token(item.chainId, item.address, item.decimals, item.name, item.name, item.logo)
    )
    daoInfo.token && ret.unshift(daoInfo.token)
    return ret
  }, [daoInfo.token])

  const onTokenTransferCallback = useTokenTransferCallback(daoInfo.token?.address)
  const onDepositCallback = useCallback(
    (to: string, value: string) => {
      showModal(<TransactionPendingModal />)
      onTokenTransferCallback(to, value)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [showModal, onTokenTransferCallback, hideModal]
  )

  const { withdrawAssetCallback } = useCreateContractProposalCallback(daoInfo.votingAddress)
  const onWithdrawCallback = useCallback(
    (title: string, content: string, startTime: number, endTime: number, tokenAddress: string, amount: string) => {
      showModal(<TransactionPendingModal />)
      withdrawAssetCallback(title, content, startTime, endTime, tokenAddress, amount)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [showModal, withdrawAssetCallback, hideModal]
  )

  return (
    <section className="assets">
      <div className="header">
        <h3>Assets</h3>
        <div className="actions">
          {account && daoInfo && (
            <>
              <Button
                onClick={() =>
                  showModal(
                    <DepositAssets
                      daoTokens={daoTokens}
                      daoAddress={daoInfo.daoAddress}
                      onDeposit={onDepositCallback}
                    />
                  )
                }
              >
                Deposit
              </Button>
              <Button
                onClick={() =>
                  showModal(<WithdrawAssets daoInfo={daoInfo} daoTokens={daoTokens} onWithdraw={onWithdrawCallback} />)
                }
              >
                Withdraw
              </Button>
            </>
          )}
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
          {daoTokens.map((item, index) => (
            <div key={index} className="token">
              <Image className="icon" width={20} src={item.logo || IconLogo} />
              <span className="name">{item.symbol}</span>
              <span className="number">
                <ShowTokenBalance token={item} account={daoInfo.daoAddress}></ShowTokenBalance>
              </span>
            </div>
          ))}
        </div>
      </Box>
    </section>
  )
}

function ShowTokenBalance({ token, account }: { token: Token; account: string }) {
  const balance = useTokenBalance(account, token)

  return <>{balance?.toSignificant(6, { groupSeparator: ',' }) || '-'}</>
}
