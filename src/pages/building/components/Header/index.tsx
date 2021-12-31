import './index.pc.less'

import 'react'

interface IHeaderProps {
  title?: string
  stepItems?: readonly string[]
  step?: string
}

export default function Index(props: IHeaderProps) {
  const { title = 'Create DAO on STPT', stepItems = ['Basic', 'Config', 'Rule', 'Review'], step = 'Basic' } = props

  return (
    <section className="building-header">
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
