import './index.pc.less'

import { useState, useCallback, useEffect } from 'react'
import BuildingHeader from './components/Header/index'
import Basic from './basic'
import Distribution from './distribution'
import Rule from './rule'
import Review from './review'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { BASE_DAO_SUPPORT_NETWORK } from '../../constants'

const stepItems = ['Basic', 'Distribution', 'Governance', 'Review'] as const

type Step = typeof stepItems[number]

export default function Index() {
  const history = useHistory()
  const [step, setStep] = useState<Step>('Basic')
  const goToStep = useCallback((step: Step) => setStep(step), [])
  const { account, chainId } = useActiveWeb3React()
  useEffect(() => {
    if (!account || !chainId || !BASE_DAO_SUPPORT_NETWORK.includes(chainId)) {
      history.replace('/create')
      return
    }
  }, [account, chainId, history])

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

  const NextComp = useCallback(() => {
    switch (step) {
      case 'Basic':
        return <Basic goNext={goNext} />
      case 'Distribution':
        return <Distribution goBack={goBack} goNext={goNext} />
      case 'Governance':
        return <Rule goBack={goBack} goNext={goNext} />
      case 'Review':
        return <Review goBack={goBack} goToStep={goToStep} />
      default:
        return null
    }
  }, [goBack, goNext, goToStep, step])

  return (
    <main className="building">
      <BuildingHeader step={step} stepItems={stepItems} />
      <NextComp />
    </main>
  )
}
