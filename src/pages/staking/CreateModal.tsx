import { Box, styled, Typography } from '@mui/material'
import Modal from '../../components/Modal'
import Button from 'components/Button/Button'
import { Input, Button as AntdButton, notification } from 'antd'
import IUpload from 'components/IUpload'
import IconUpload from '../../assets/images/icon-upload.svg'
import { useCallback, useMemo, useState } from 'react'
import DatePicker from 'components/DatePicker'
import { isAddress } from 'utils'
import { useToken } from 'state/wallet/hooks'
import { useTotalSupply } from 'data/TotalSupply'
import { tryParseAmount, useWalletModalToggle } from 'state/application/hooks'
import { useActiveWeb3React } from 'hooks'
import JSBI from 'jsbi'
import { useCreateMyAirdrop } from 'hooks/staking/useServerCallback'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'

const Item = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  '.btn-upload': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    borderRadius: '8px',
    width: '80px',
    height: '80px',
    overflow: 'hidden'
  },
  '.ant-input': {
    background: '#FAFAFA',
    borderRadius: '8px'
  }
})

export default function CreateModal({ reloadList }: { reloadList: () => void }) {
  const toggleWalletModal = useWalletModalToggle()
  const { account } = useActiveWeb3React()
  const [previewStr, setPreviewStr] = useState('')
  const { showModal, hideModal } = useModal()

  const [tokenAddress, setTokenAddress] = useState('')
  const [logo, setLogo] = useState('')
  const [amount, setAmount] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')
  const [startTime, setStartTime] = useState<number>()

  const curToken = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
  const totalSupply = useTotalSupply(curToken)

  const tokenAmount = useMemo(() => tryParseAmount(amount, curToken), [amount, curToken])

  const createMyAirdropCallback = useCreateMyAirdrop()
  const onCreateMyAirdrop = useCallback(() => {
    createMyAirdropCallback({
      airdropAmount: amount,
      airdropTime: startTime || 0,
      mediumLink: websiteLink,
      tokenContractAddress: tokenAddress,
      tokenLogo: logo
    })
      .then(() => {
        hideModal()
        notification.open({
          message: 'Create success'
        })
        reloadList()
      })
      .catch(err => {
        showModal(<MessageBox type="error">{err}</MessageBox>)
      })
  }, [amount, createMyAirdropCallback, hideModal, logo, reloadList, showModal, startTime, tokenAddress, websiteLink])

  const createBtn = useMemo(() => {
    if (!account) {
      return <Button onClick={toggleWalletModal}>Connect Wallet</Button>
    }
    if (!curToken) return <Button disabled>Input token address</Button>
    if (!tokenAmount || !tokenAmount.greaterThan(JSBI.BigInt(0))) return <Button disabled>Input amount</Button>
    if (!startTime) return <Button disabled>Select airdrop time</Button>

    return <Button onClick={onCreateMyAirdrop}>Create</Button>
  }, [account, curToken, startTime, toggleWalletModal, tokenAmount, onCreateMyAirdrop])

  return (
    <Modal closeIcon maxWidth="700px">
      <Typography variant="h4" fontWeight={500} fontSize={24}>
        Create project
      </Typography>
      <Box margin="30px 0" display={'grid'} gap="20px">
        <Item>
          <Typography variant="h6">Token contract address</Typography>
          <Input
            placeholder=""
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value)}
            onBlur={() => {
              if (!isAddress(tokenAddress)) setTokenAddress('')
            }}
          />
        </Item>
        <Item>
          <Typography variant="h6">Token Photo</Typography>
          <Box display={'flex'} alignItems={'center'} gap="5px">
            <IUpload setResult={val => setLogo(val)} onPreviewStr={str => setPreviewStr(str)}>
              <AntdButton className="btn-upload" style={{ padding: 5 }}>
                <img
                  src={previewStr || logo || IconUpload}
                  width={previewStr || logo ? '100%' : 'auto'}
                  height={previewStr || logo ? '100%' : 'auto'}
                />
              </AntdButton>
            </IUpload>
            <Typography>File types supported: JPG, PNG. Max size: 500KB</Typography>
          </Box>
        </Item>
        <Box style={{ display: 'grid', marginBottom: '10px' }} gridTemplateColumns="1fr 1fr" className="input-item">
          <Typography variant="h6">Token name: {curToken ? curToken.name : '--'}</Typography>
          <Typography variant="h6">Token symbol: {curToken ? curToken.symbol : '--'}</Typography>
          <Typography variant="h6">Token Decimals: {curToken ? curToken.decimals : '--'}</Typography>
          <Typography variant="h6">
            Token Supply: {totalSupply ? totalSupply.toSignificant(6, { groupSeparator: ',' }) : '--'}
          </Typography>
        </Box>
        <Item>
          <Typography variant="h6">Airdrop amount</Typography>
          <Input
            placeholder=""
            maxLength={30}
            value={amount}
            onChange={e => {
              const _val = e.target.value
              if (isNaN(Number(_val))) return
              const reg = new RegExp('^[0-9.]*$')
              if (reg.test(_val)) {
                setAmount(_val)
              }
            }}
          />
        </Item>
        <Item>
          <Typography variant="h6">Medium link</Typography>
          <Input placeholder="" value={websiteLink} onChange={e => setWebsiteLink(e.target.value)} />
        </Item>
        <Item>
          <Typography variant="h6">Airdrop time(estimate)</Typography>
          <DatePicker
            valueStamp={startTime}
            disabledPassTime={new Date()}
            onChange={timeStamp => setStartTime(timeStamp)}
          />
        </Item>
      </Box>

      {createBtn}
    </Modal>
  )
}
