import styles from '../../../DaoDetail/components/CreateProposal/index.module.less'
import { Input } from 'antd'
import { Box, Typography } from '@mui/material'
// import TextArea from 'antd/lib/input/TextArea'
import OutlineButton from 'components/Button/OutlineButton'
import { BlackButton } from 'components/Button/Button'
import DatePicker from 'components/DatePicker'
import InputOptions from 'components/Input/InputOptions'
import { ExternalDaoInfoProps } from 'hooks/useDAOInfo'
import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import Confirm from './Confirm'
import { useCreateCrossProposalCallback } from 'hooks/useCreateCommunityProposalCallback'
import { useCreateProposalSignData } from 'hooks/useBackedCrossServer'
import { TokenAmount } from 'constants/token'
import { commitErrorMsg, uploadPictureAddress } from 'utils/fetch/server'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

interface Props {
  onBack: () => void
  daoInfo: ExternalDaoInfoProps | undefined
}

const save = async function*(_: ArrayBuffer, file: Blob) {
  const upload = () => {
    const params = new FormData()
    params.append('file', file)
    return axios.post(uploadPictureAddress(), params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
  // Upload "data" to your server
  // Use XMLHttpRequest.send to send a FormData object containing
  // "data"
  // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest
  const data = (await (await upload()).data.data) as string
  // yields the URL that should be inserted in the markdown
  yield data

  // returns true meaning that the save was successful
  return true
}

export default function Index(props: Props) {
  const { onBack, daoInfo } = props
  const { account } = useActiveWeb3React()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview' | undefined>('write')
  const [option, setOption] = useState<string[]>(['Approve', 'Disapprove'])
  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const toggleWalletModal = useWalletModalToggle()
  const { hideModal, showModal } = useModal()
  const createCommunityProposalCallback = useCreateCrossProposalCallback(daoInfo?.votingAddress)
  const createProposalSignData = useCreateProposalSignData(daoInfo?.token?.chainId, daoInfo?.daoAddress)

  const usrBalance = useMemo(
    () =>
      daoInfo?.token && createProposalSignData
        ? new TokenAmount(daoInfo.token, createProposalSignData.balance)
        : undefined,
    [createProposalSignData, daoInfo?.token]
  )

  const endTimeDIsabled = useMemo(() => {
    if (!daoInfo?.rule) return true
    if (Number(daoInfo.rule.communityVotingDuration) > 0) {
      return true
    }
    return false
  }, [daoInfo?.rule])

  const onCreateCommunityProposalCallback = useCallback(async () => {
    if (!title.trim() || !startTime || !endTime || !createProposalSignData) return
    const curOption = option.filter(i => i.trim())
    showModal(<TransactionPendingModal />)

    // let commitLink = ''
    // try {
    //   commitLink = await (await commitProposalText(desc || '')).data.data
    // } catch (err) {
    //   const error = err as any
    //   showModal(<MessageBox type="error">{error?.data?.msg || 'commit content error, please try again'}</MessageBox>)
    // }

    createCommunityProposalCallback(
      { title, content: `/^[markdown]/${desc}`, startTime, endTime, options: curOption },
      createProposalSignData.userAddress,
      createProposalSignData.balance,
      createProposalSignData.chainId,
      createProposalSignData.votingAddress,
      createProposalSignData.nonce,
      createProposalSignData.sign
    )
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
        commitErrorMsg(
          'CreateCommunityProposal',
          `${err?.error?.message || ''} ${err?.message || ''} ${err?.data?.message || ''}`,
          'onCreateCommunityProposalCallback',
          JSON.stringify([
            { title, content: desc, startTime, endTime, options: curOption },
            createProposalSignData.userAddress,
            createProposalSignData.balance,
            createProposalSignData.chainId,
            createProposalSignData.votingAddress,
            createProposalSignData.nonce,
            createProposalSignData.sign
          ])
        )
        showModal(
          <MessageBox type="error">
            {err?.data?.message || err?.error?.message || err?.message || 'unknown error'}
          </MessageBox>
        )
        console.error(err)
      })
  }, [
    createCommunityProposalCallback,
    createProposalSignData,
    desc,
    endTime,
    hideModal,
    onBack,
    option,
    showModal,
    startTime,
    title
  ])

  const addOption = useCallback(() => {
    if (option.length >= 6) return
    setOption([...option, ''])
  }, [option])

  const getActions = useMemo(() => {
    if (!account) {
      return (
        <BlackButton width="233px" height="48px" style={{ margin: 'auto' }} onClick={toggleWalletModal}>
          Connect Wallet
        </BlackButton>
      )
    }
    if (!title.trim()) {
      return (
        <BlackButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Title required
        </BlackButton>
      )
    }
    if (!startTime) {
      return (
        <BlackButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Start time required
        </BlackButton>
      )
    }
    if (!endTime) {
      return (
        <BlackButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          End time required
        </BlackButton>
      )
    }
    if (endTime <= startTime) {
      return (
        <BlackButton width="100%" height="48px" style={{ margin: 'auto' }} disabled>
          Start time must be less than end time
        </BlackButton>
      )
    }
    if (option.filter(i => i.trim()).length < 2) {
      return (
        <BlackButton width="100%" height="48px" style={{ margin: 'auto' }} disabled>
          Minimum two options
        </BlackButton>
      )
    }

    if (
      !usrBalance ||
      !daoInfo?.rule?.minimumCreateProposal ||
      usrBalance?.lessThan(daoInfo?.rule?.minimumCreateProposal)
    ) {
      return (
        <BlackButton width="233px" height="48px" style={{ margin: 'auto' }} disabled>
          Balance Insufficient
        </BlackButton>
      )
    }

    return (
      <BlackButton
        width="233px"
        height="48px"
        style={{ margin: 'auto' }}
        onClick={() =>
          showModal(
            <Confirm
              title={title}
              endTime={endTime}
              startTime={startTime}
              minimumCreateProposal={daoInfo?.rule?.minimumCreateProposal}
              onCreate={onCreateCommunityProposalCallback}
            />
          )
        }
      >
        Create a Proposal
      </BlackButton>
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
    usrBalance
  ])

  return (
    <div className={styles.container}>
      <Box>
        <Typography
          sx={{ cursor: 'pointer' }}
          fontWeight={500}
          mb={20}
          display={'inline-flex'}
          onClick={onBack}
          alignItems="center"
        >
          <ArrowBackIcon sx={{ height: 16 }}></ArrowBackIcon>All Proposals
        </Typography>
      </Box>
      <p className={styles.title}>Create Proposal</p>
      <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} className={styles.form}>
        <Box display={'grid'} gap={10}>
          <Box className="input-item">
            <span className="label">Title</span>
            <Input placeholder="" value={title} maxLength={120} onChange={e => setTitle(e.target.value)} />
          </Box>
          <Box className="input-item">
            <span className="label">Description</span>
            <ReactMde
              value={desc}
              onChange={setDesc}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
              childProps={{
                writeButton: {
                  tabIndex: -1
                }
              }}
              paste={{
                saveImage: save
              }}
            />
            {/* <TextArea rows={5} value={desc} maxLength={3000} onChange={e => setDesc(e.target.value)} /> */}
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
              <Typography fontWeight={500}>Your balance</Typography>
              <Typography fontWeight={500}>
                {usrBalance ? usrBalance?.toSignificant(6, { groupSeparator: ',' }) : '-'} {daoInfo?.token?.symbol}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center" mb={10}>
              <Typography marginRight={'10px'} fontWeight={500} maxWidth="80%">
                Minimum holding required to create proposal
              </Typography>
              <Typography fontWeight={500} textAlign="right">
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
