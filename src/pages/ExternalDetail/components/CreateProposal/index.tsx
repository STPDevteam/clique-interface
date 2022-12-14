import styles from '../../../DaoDetail/components/CreateProposal/index.module.less'
import { Button, Input } from 'antd'
import { Box, Typography } from '@mui/material'
import TextArea from 'antd/lib/input/TextArea'
import OutlineButton from 'components/Button/OutlineButton'
import MButton from 'components/Button/Button'
import DatePicker from 'components/DatePicker'
import InputOptions from 'components/Input/InputOptions'
import { ExternalDaoInfoProps } from 'hooks/useDAOInfo'
import { useCallback, useMemo, useState } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import Confirm from './Confirm'
import { useCreateCommunityProposalCallback } from 'hooks/useCreateCommunityProposalCallback'

interface Props {
  onBack: () => void
  daoInfo: ExternalDaoInfoProps | undefined
}

export default function Index(props: Props) {
  const { onBack, daoInfo } = props
  const { account } = useActiveWeb3React()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [option, setOption] = useState<string[]>(['Approve', 'Disapprove'])
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const toggleWalletModal = useWalletModalToggle()
  const { hideModal, showModal } = useModal()
  const createCommunityProposalCallback = useCreateCommunityProposalCallback(daoInfo?.votingAddress)

  const daoTokenBalance = useTokenBalance(account || undefined, daoInfo?.token)

  const endTimeDIsabled = useMemo(() => {
    if (!daoInfo?.rule) return true
    if (Number(daoInfo.rule.communityVotingDuration) > 0) {
      return true
    }
    return false
  }, [daoInfo?.rule])

  const onCreateCommunityProposalCallback = useCallback(() => {
    if (!title.trim() || !startTime || !endTime) return
    const curOption = option.filter(i => i.trim())
    showModal(<TransactionPendingModal />)
    createCommunityProposalCallback(title, desc, startTime, endTime, curOption)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal hideFunc={onBack} />)
        setTitle('')
        setDesc('')
        setStartTime(undefined)
        setEndTime(undefined)
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
  }, [createCommunityProposalCallback, desc, endTime, hideModal, onBack, option, showModal, startTime, title])

  const addOption = useCallback(() => {
    if (option.length >= 6) return
    setOption([...option, ''])
  }, [option])

  const tokenBalance = useTokenBalance(account || undefined, daoInfo?.token)
  const getActions = useMemo(() => {
    if (!account) {
      return (
        <MButton width="233px" height="48px" style={{ margin: 'auto' }} onClick={toggleWalletModal}>
          Connect Wallet
        </MButton>
      )
    }
    if (!title.trim()) {
      return (
        <MButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Title required
        </MButton>
      )
    }
    if (!startTime) {
      return (
        <MButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Start time required
        </MButton>
      )
    }
    if (!endTime) {
      return (
        <MButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          End time required
        </MButton>
      )
    }
    if (endTime <= startTime) {
      return (
        <MButton width="100%" height="48px" style={{ margin: 'auto' }} disabled>
          Start time must be less than end time
        </MButton>
      )
    }
    if (option.filter(i => i.trim()).length < 2) {
      return (
        <MButton width="100%" height="48px" style={{ margin: 'auto' }} disabled>
          Minimum two options
        </MButton>
      )
    }

    if (
      !tokenBalance ||
      !daoInfo?.rule?.minimumCreateProposal ||
      tokenBalance?.lessThan(daoInfo?.rule?.minimumCreateProposal)
    ) {
      return (
        <MButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Balance Insufficient
        </MButton>
      )
    }

    return (
      <MButton
        width="233px"
        height="48px"
        style={{ margin: 'auto' }}
        onClick={() =>
          showModal(
            <Confirm
              title={title}
              endTime={endTime}
              startTime={startTime}
              minimumCreateProposal={daoInfo.rule?.minimumCreateProposal}
              onCreate={onCreateCommunityProposalCallback}
            />
          )
        }
      >
        Create a Proposal
      </MButton>
    )
  }, [
    account,
    daoInfo?.rule?.minimumCreateProposal,
    endTime,
    onCreateCommunityProposalCallback,
    option,
    showModal,
    startTime,
    title,
    toggleWalletModal,
    tokenBalance
  ])

  return (
    <div className={styles.container}>
      <Button className={styles['btn-back']} onClick={onBack}>
        Back
      </Button>
      <p className={styles.title}>Create Proposal</p>
      <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} className={styles.form}>
        <Box padding={'0 41px'} display={'grid'} gap={10} sx={{ borderRight: '1px dashed #3898FC' }}>
          <Box className="input-item">
            <span className="label">Title</span>
            <Input placeholder="" value={title} maxLength={120} onChange={e => setTitle(e.target.value)} />
          </Box>
          <Box className="input-item">
            <span className="label">Description</span>
            <TextArea rows={4} value={desc} maxLength={3000} onChange={e => setDesc(e.target.value)} />
          </Box>
          <Box className="input-item">
            <span className="label">Voting Options</span>
            <Box display={'grid'} width={'100%'} gap="10px">
              {option.map((item, index) =>
                index <= 1 ? (
                  <Input
                    value={item}
                    onChange={e => {
                      const _new = [...option]
                      _new[index] = e.target.value
                      setOption(_new)
                    }}
                  />
                ) : (
                  <InputOptions
                    value={item}
                    onChange={val => {
                      const _new = [...option]
                      _new[index] = val
                      setOption(_new)
                    }}
                    remove={() => {
                      const _new = [...option]
                      _new.splice(index, 1)
                      setOption(_new)
                    }}
                  />
                )
              )}

              <OutlineButton width={122} height={48} style={{ margin: 'auto' }} onClick={addOption}>
                + Add
              </OutlineButton>
            </Box>
          </Box>
        </Box>
        <div>
          <Box padding={'0 41px'} display={'grid'} gap={10}>
            <Box className="input-item">
              <span className="label">Start time</span>
              <DatePicker
                valueStamp={startTime}
                disabledPassTime={new Date()}
                onChange={timeStamp => {
                  setStartTime(timeStamp)
                  if (endTimeDIsabled) {
                    setEndTime(timeStamp ? timeStamp + Number(daoInfo?.rule?.communityVotingDuration || 0) : undefined)
                  }
                }}
              />
            </Box>
            <Box className="input-item" mb={10}>
              <span className="label">End time</span>
              <DatePicker
                valueStamp={endTime}
                disabled={endTimeDIsabled}
                disabledPassTime={startTime ? startTime * 1000 : new Date()}
                onChange={timeStamp => setEndTime(timeStamp)}
              />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={10}>
              <Typography>Your balance</Typography>
              <Typography>
                {daoTokenBalance ? daoTokenBalance?.toSignificant(6, { groupSeparator: ',' }) : '-'}{' '}
                {daoInfo?.token?.symbol}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center" mb={10}>
              <Typography marginRight={'10px'} maxWidth="80%">
                Minimum holding required to create proposal
              </Typography>
              <Typography>
                {daoInfo?.rule?.minimumCreateProposal
                  ? daoInfo?.rule?.minimumCreateProposal.toSignificant(6, { groupSeparator: ',' })
                  : '-'}{' '}
                {daoInfo?.token?.symbol}
              </Typography>
            </Box>
            {/* <Box
              mb={10}
              sx={{
                background: '#FAFAFA',
                borderRadius: '8px',
                padding: '13px 44px'
              }}
            >
              {daoInfo?.rule?.minimumCreateProposal.toSignificant(18, { groupSeparator: ',' })} {daoInfo?.token?.symbol}{' '}
              required to create proposal
            </Box> */}
            {getActions}
          </Box>
        </div>
      </Box>
    </div>
  )
}
