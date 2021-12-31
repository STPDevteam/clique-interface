import './pc.less'

import 'react'
import { IModalProps } from '..'
import { Button, Modal } from 'antd'

export interface IConfirmProposalProps extends IModalProps {
  startTime: string
  endTime: string
  stakeNumber: string
}

export default function ConfirmProposal(props: IConfirmProposalProps) {
  const { onClose, visible, startTime, endTime, stakeNumber } = props

  return (
    <Modal className="confirm-proposal" footer={null} title={null} onCancel={onClose} visible={visible}>
      <h1>Confirm Proposal</h1>
      <span className="subtitle">Your Proposal</span>
      <p className="question">Why Don’t Tech Companies Pay Their Engineers to Stay?</p>
      <div className="kv-wrapper">
        <div className="kv">
          <span>Start time</span>
          <span>{startTime}</span>
        </div>
        <div className="kv">
          <span>End time</span>
          <span>{endTime}</span>
        </div>
        <div className="kv">
          <span>You will stake</span>
          <span>{stakeNumber}</span>
        </div>
      </div>
      <p className="quote">Are you sure you want to vote for the above choice? This action cannot be undone.</p>
      <div className="btn-group">
        <Button className="btn-common btn-04 btn-cancel">Cancel</Button>
        <Button className="btn-common btn-01 btn-stake">Stake STPT and Create</Button>
      </div>
    </Modal>
  )
}
