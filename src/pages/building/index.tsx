import './index.pc.less'

import { useState, useCallback } from 'react'
import { Button } from 'antd'
import BuildingHeader from './components/Header/index'
import Basic from './basic'
import Distribution from './distribution'
import Rule from './rule'
import Review from './review'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/material'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'

const stepItems = ['Basic', 'Distribution', 'Rule', 'Review'] as const

type Step = typeof stepItems[number]

export default function Index() {
  const history = useHistory()
  const [step, setStep] = useState<Step>('Basic')
  const { showModal, hideModal } = useModal()
  const goToStep = useCallback((step: Step) => setStep(step), [])

  const NextComp = useCallback(() => {
    switch (step) {
      case 'Basic':
        return <Basic />
      case 'Distribution':
        return <Distribution />
      case 'Rule':
        return <Rule />
      case 'Review':
        return <Review goToStep={goToStep} />
      default:
        return null
    }
  }, [goToStep, step])

  const goBack = useCallback(() => {
    const index = stepItems.findIndex(item => item === step)
    if (index - 1 >= 0) {
      setStep(stepItems[index - 1])
    } else {
      history.goBack()
    }
  }, [history, step])

  const goNext = useCallback(() => {
    const index = stepItems.findIndex(item => item === step)
    setStep(stepItems[index + 1])
  }, [step])

  const onCreate = useCallback(() => {
    showModal(<TransacitonPendingModal />)
    setTimeout(() => {
      hideModal()
      history.push('/building/launching')
    }, 3000)
  }, [hideModal, history, showModal])

  return (
    <main className="building">
      <BuildingHeader step={step} stepItems={stepItems} />
      <NextComp />
      <Box
        className="btn-group"
        display={'flex'}
        justifyContent={step === 'Basic' || step === 'Review' ? 'center' : 'space-between'}
      >
        {step !== 'Basic' && step !== 'Review' && (
          <Button className="btn-common btn-04" onClick={goBack}>
            Back
          </Button>
        )}
        {step !== 'Review' ? (
          <Button className="btn-common btn-01" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button style={{ width: 'auto' }} className="btn-common btn-01" onClick={onCreate}>
            I have confirmed and created the DAO
          </Button>
        )}
      </Box>
    </main>
  )
}
