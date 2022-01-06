import styles from './index.module.less'
import { Button, Input } from 'antd'
import { Box, Typography } from '@mui/material'
import TextArea from 'antd/lib/input/TextArea'
import OutlineButton from 'components/Button/OutlineButton'
import MButton from 'components/Button/Button'
import DatePicker from 'components/DatePicker'
import InputOptions from 'components/Input/InputOptions'
import { DaoInfoProps } from 'hooks/useDAOInfo'
import { useCallback, useMemo, useState } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

interface Props {
  onBack: () => void
  daoInfo: DaoInfoProps | undefined
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
      <MButton width="233px" height="48px" style={{ margin: 'auto' }}>
        Create a Proposal
      </MButton>
    )
  }, [
    account,
    daoInfo?.rule?.minimumCreateProposal,
    endTime,
    option,
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
            <Input placeholder="" value={title} maxLength={60} onChange={e => setTitle(e.target.value)} />
          </Box>
          <Box className="input-item">
            <span className="label">Content</span>
            <TextArea rows={4} value={desc} maxLength={500} onChange={e => setDesc(e.target.value)} />
          </Box>
          <Box className="input-item">
            <span className="label">Vote options</span>
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
                onChange={timeStamp => setStartTime(timeStamp)}
              />
            </Box>
            <Box className="input-item" mb={10}>
              <span className="label">End time</span>
              <DatePicker
                valueStamp={endTime}
                disabledPassTime={startTime ? startTime * 1000 : new Date()}
                onChange={timeStamp => setEndTime(timeStamp)}
              />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={10}>
              <Typography>Your balance</Typography>
              <Typography>0 STPT</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={10}>
              <Typography>Create a proposal need stakes</Typography>
              <Typography>2,000 STPT</Typography>
            </Box>
            <Box
              mb={10}
              sx={{
                background: '#FAFAFA',
                borderRadius: '8px',
                padding: '13px 44px'
              }}
            >
              Valid votes greater than 100,000 will be considered valid proposals
            </Box>
            {getActions}
          </Box>
        </div>
      </Box>
    </div>
  )
}
