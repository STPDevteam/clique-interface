import './pc.less'

import { Fragment } from 'react'
import { IModalProps } from '..'
import { Modal, Button } from 'antd'
import IconSuccess from '../assets/icon-success.svg'

type Result = 'success' | 'fail'

export interface IStatusProps extends IModalProps {
  amount: string
  memo: string
  result: Result
}

export default function Status(props: IStatusProps) {
  const { onClose, visible, amount, memo, result } = props

  return (
    <Modal className="op-status" footer={null} title={null} onCancel={onClose} visible={visible}>
      {result === 'success' && (
        <Fragment>
          <img src={IconSuccess} />
          <h3>Deposit Successful</h3>
        </Fragment>
      )}
      {result === 'fail' && (
        <Fragment>
          <img src={IconSuccess} />
          <h3>Deposit Successful</h3>
        </Fragment>
      )}
      <div className="kv-wrapper">
        <div className="kv">
          <span>Amount</span>
          <span>{amount}</span>
        </div>
        <div className="kv">
          <span>Memo</span>
          <span>{memo}</span>
        </div>
      </div>
      <Button className="btn-common btn-01 btn-done">Done</Button>
    </Modal>
  )
}
