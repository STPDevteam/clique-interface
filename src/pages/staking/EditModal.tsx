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
import { useEditMyAirdrop } from 'hooks/staking/useServerCallback'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { MyAirdropResProp } from 'hooks/staking/useServerData'

const Item = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  '.btn-upload': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.4)',
    borderRadius: '8px',
    width: '80px',
    height: '80px',
    overflow: 'hidden'
  },
  '.ant-input': {
    background: '#FAFAFA',
    boxShadow: 'inset 2px 2px 5px rgb(105 141 173 / 40%)',
    borderRadius: '8px'
  }
})

export default function EditModal({ reloadList, item }: { reloadList: () => void; item: MyAirdropResProp }) {
  const toggleWalletModal = useWalletModalToggle()
  const { account } = useActiveWeb3React()
  const [previewStr, setPreviewStr] = useState('')
  const { showModal, hideModal } = useModal()

  const [tokenAddress, setTokenAddress] = useState(item.tokenContractAddress)
  const [logo, setLogo] = useState(item.tokenLogo)
  const [amount, setAmount] = useState(item.airdropAmount)
  const [websiteLink, setWebsiteLink] = useState(item.mediumLink)
  const [startTime, setStartTime] = useState<number>(item.airdropTime)

  const curToken = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
  const totalSupply = useTotalSupply(curToken)

  const tokenAmount = useMemo(() => tryParseAmount(amount, curToken), [amount, curToken])

  const editMyAirdropCallback = useEditMyAirdrop()
  const onEditMyAirdrop = useCallback(() => {
    editMyAirdropCallback(item.id, {
      airdropAmount: amount,
      airdropTime: startTime || 0,
      mediumLink: websiteLink,
      tokenContractAddress: tokenAddress,
      tokenLogo: logo
    })
      .then(() => {
        hideModal()
        notification.open({
          message: 'Edit success'
        })
        reloadList()
      })
      .catch(err => {
        showModal(<MessageBox type="error">{err}</MessageBox>)
      })
  }, [
    amount,
    editMyAirdropCallback,
    hideModal,
    item.id,
    logo,
    reloadList,
    showModal,
    startTime,
    tokenAddress,
    websiteLink
  ])

  const editBtn = useMemo(() => {
    if (!account) {
      return <Button onClick={toggleWalletModal}>Connect Wallet</Button>
    }
    if (!curToken) return <Button disabled>Input token address</Button>
    if (!tokenAmount || !tokenAmount.greaterThan(JSBI.BigInt(0))) return <Button disabled>Input amount</Button>
    if (!startTime) return <Button disabled>Select airdrop time</Button>

    return <Button onClick={onEditMyAirdrop}>Edit</Button>
  }, [account, curToken, startTime, toggleWalletModal, tokenAmount, onEditMyAirdrop])

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
            disabled={item.status === 'onChain'}
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
            disabled={item.status === 'onChain'}
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
            disabled={item.status === 'onChain'}
            disabledPassTime={new Date()}
            onChange={timeStamp => timeStamp && setStartTime(timeStamp)}
          />
        </Item>
      </Box>

      {editBtn}
    </Modal>
  )
}
