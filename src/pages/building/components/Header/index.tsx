import './index.pc.less'

import 'react'
import OutlineButton from 'components/Button/OutlineButton'
import { useHistory } from 'react-router-dom'

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
    <section className="building-header">
      <OutlineButton className="back" onClick={() => history.replace('/')}>
        Home
      </OutlineButton>
      <h1>{title}</h1>
      <div className="step-list">
        {stepItems.map((item, index) => (
          <span key={index} className={`step-item ${step === item ? 'active' : ''}`}>
            {`${index + 1}. ${item}`}
          </span>
        ))}
      </div>
    </section>
  )
}
