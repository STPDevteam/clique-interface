import './pc.less'

import 'react'
import { Input, InputNumber, Button } from 'antd'

const { TextArea } = Input

export default function Configuration() {
  return (
    <section className="configuration">
      <h1>Configuration</h1>
      <div className="input-item pc-mt-29">
        <span className="label">Contract Address</span>
        <Input placeholder="" />
      </div>
      <div className="input-item pc-mt-17">
        <span className="label">Contract Voting Duration</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="datetime-wrapper">
            <InputNumber min={0} className="input-number-common" />
            <span>Days</span>
          </div>
          <div className="datetime-wrapper">
            <InputNumber min={0} className="input-number-common" />
            <span>Hours</span>
          </div>
          <div className="datetime-wrapper">
            <InputNumber min={0} className="input-number-common" />
            <span>Minutes</span>
          </div>
        </div>
      </div>
      <div className="input-item pc-mt-18">
        <span className="label">Rules / Agreement</span>
        <TextArea className="drag-area" rows={5} />
      </div>
      <Button className="btn-common btn-02 btn-update pc-mt-25">Update</Button>
    </section>
  )
}
