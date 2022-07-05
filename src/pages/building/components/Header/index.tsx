import './index.pc.less'

import 'react'
import { useHistory } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface IHeaderProps {
  title?: string
  stepItems?: readonly string[]
  step?: string
}

export default function Index(props: IHeaderProps) {
  const history = useHistory()
  const {
    title = 'Create a DAO with Framework',
    stepItems = ['Basic', 'Config', 'Rule', 'Review'],
    step = 'Basic'
  } = props

  return (
    <Box mt={40} padding="0 50px">
      <Box>
        <Typography
          sx={{ cursor: 'pointer' }}
          fontWeight={500}
          display={'inline-flex'}
          onClick={() => history.replace('/')}
          alignItems="center"
        >
          <ArrowBackIcon sx={{ height: 16 }}></ArrowBackIcon>Home
        </Typography>
      </Box>
      <section className="building-header">
        <Typography fontSize={20} fontWeight={600}>
          {title}
        </Typography>
        <div className="step-list">
          {stepItems.map((item, index) => (
            <span key={index} className={`step-item ${step === item ? 'active' : ''}`}>
              {`${index + 1}. ${item}`}
            </span>
          ))}
        </div>
      </section>
    </Box>
  )
}
