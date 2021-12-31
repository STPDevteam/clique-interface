import styles from './index.module.less'
import { Button, Input } from 'antd'
import { Box, Typography } from '@mui/material'
import TextArea from 'antd/lib/input/TextArea'
import OutlineButton from 'components/Button/OutlineButton'
import MButton from 'components/Button/Button'
import DatePicker from 'components/DatePicker'
import InputOptions from 'components/Input/InputOptions'

export default function Index(props: any) {
  const { onBack } = props
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
            <Input placeholder="" />
          </Box>
          <Box className="input-item">
            <span className="label">Content</span>
            <TextArea rows={4} />
          </Box>
          <Box className="input-item">
            <span className="label">Vote options</span>
            <Box display={'grid'} width={'100%'} gap="10px">
              <Input value={'Approve'} disabled />
              <Input value={'Disapprove'} disabled />
              <InputOptions value={'Disapprove'} />
              <OutlineButton width={122} height={48} style={{ margin: 'auto' }}>
                + Add
              </OutlineButton>
            </Box>
          </Box>
        </Box>
        <div>
          <Box padding={'0 41px'} display={'grid'} gap={10}>
            <Box className="input-item">
              <span className="label">Start time</span>
              <DatePicker />
            </Box>
            <Box className="input-item" mb={10}>
              <span className="label">End time</span>
              <DatePicker disabledPassTime={new Date('2021-12-20')} />
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
            <MButton width="233px" height="48px" style={{ margin: 'auto' }}>
              Create a Proposal
            </MButton>
          </Box>
        </div>
      </Box>
    </div>
  )
}
