import './pc.less'

import Button from 'components/Button/Button'
import IconLink from '../../../../assets/images/icon-link.svg'
import IconLogo from '../../../../assets/images/icon-token.svg'
import { WithdrawAssets, DepositAssets } from '../../../../components/ModalSTP'
import { Box, Grid } from '@mui/material'
import useModal from 'hooks/useModal'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useCallback, useMemo, useState } from 'react'
import { Token, TokenAmount } from 'constants/token'
import Image from 'components/Image'
import { useToken, useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useTokenTransferCallback } from 'hooks/useTokenTransferCallback'
import { useCreateContractProposalCallback } from 'hooks/useCreateContractProposalCallback'
import { useCurPrivateReceivingTokens } from 'state/building/hooks'
import { AssetsTransferRecordProp, useAssetsTransferRecord } from 'hooks/useBackedServer'
import { Empty, Pagination, Spin } from 'antd'
import { timeStampToFormat, titleCase } from 'utils/dao'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'
import { DefaultChainId } from '../../../../constants'

export default function Assets({ daoInfo }: { daoInfo: DaoInfoProps }) {
  const { showModal, hideModal } = useModal()
  const { account, chainId } = useActiveWeb3React()
  const [selectDepositAddress, setSelectDepositAddress] = useState<string>()

  const curPrivateReceivingTokens = useCurPrivateReceivingTokens()

  const daoTokens = useMemo(() => {
    const ret = curPrivateReceivingTokens.map(
      item => new Token(item.chainId, item.address, item.decimals, item.name, item.name, item.logo)
    )
    daoInfo.token && ret.unshift(daoInfo.token)
    return ret
  }, [curPrivateReceivingTokens, daoInfo.token])

  const getSymbolFromAddress = useCallback(
    (address: string) => {
      const ret = daoTokens.find(item => item.address.toLowerCase() === address.toLowerCase())
      return ret?.symbol
    },
    [daoTokens]
  )

  const onTokenTransferCallback = useTokenTransferCallback(selectDepositAddress)
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
      withdrawAssetCallback(title, content, tokenAddress, amount)
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
  const { page, loading, result: assetsTransferRecord } = useAssetsTransferRecord(daoInfo.daoAddress)

  return (
    <section className="assets">
      <div className="header">
        <h3>Assets</h3>
        <Box display={'flex'} gap="15px">
          {account && daoInfo && (
            <>
              <Button
                width={'150px'}
                onClick={() =>
                  showModal(
                    <DepositAssets
                      daoTokens={daoTokens}
                      setSelectDepositAddress={val => setSelectDepositAddress(val)}
                      daoAddress={daoInfo.daoAddress}
                      onDeposit={onDepositCallback}
                    />
                  )
                }
              >
                Deposit
              </Button>
              <Button
                width={'150px'}
                onClick={() =>
                  showModal(<WithdrawAssets daoInfo={daoInfo} daoTokens={daoTokens} onWithdraw={onWithdrawCallback} />)
                }
              >
                Withdraw
              </Button>
            </>
          )}
        </Box>
      </div>
      <Grid container spacing={20} className="transactions">
        <Grid item lg={8} xs={12}>
          {loading && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50}>
              <Spin size="large" tip="Loading..." />
            </Box>
          )}
          {!loading && assetsTransferRecord.length === 0 && (
            <Box display={'flex'} justifyContent={'center'} width={'100%'} mt={50}>
              <Empty description="No records currently" />
            </Box>
          )}
          <div className="history-list">
            {!loading &&
              assetsTransferRecord.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="left">
                    <span>
                      {titleCase(item.type)} {getSymbolFromAddress(item.tokenAddress)}
                    </span>
                    <span>{timeStampToFormat(item.timeStamp)}</span>
                  </div>
                  <div className="right">
                    <ShowTransferValue data={item} />
                    <ExternalLink
                      href={getEtherscanLink(chainId || DefaultChainId, item.hash, 'transaction')}
                      className="link"
                    >
                      <img src={IconLink} />
                    </ExternalLink>
                  </div>
                </div>
              ))}
          </div>
          <Box display={'flex'} justifyContent={'center'}>
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
        </Grid>
        <Grid item lg={4} xs={12}>
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
        </Grid>
      </Grid>
    </section>
  )
}

function ShowTokenBalance({ token, account }: { token: Token; account: string }) {
  const balance = useTokenBalance(account, token)

  return <>{balance?.toSignificant(6, { groupSeparator: ',' }) || '-'}</>
}

function ShowTransferValue({ data }: { data: AssetsTransferRecordProp }) {
  const token = useToken(data.tokenAddress)
  const curValue = useMemo(() => {
    if (!token) return undefined
    return new TokenAmount(token, data.value)
  }, [data.value, token])
  return (
    <div className="amount">
      <span>{token?.symbol || '-'}</span>
      <span>
        {data.mark}
        {curValue?.toSignificant(6, { groupSeparator: ',' })}
      </span>
    </div>
  )
}
