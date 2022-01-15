export { default as WithdrawAssets } from './WithdrawAssets'
export { default as DepositAssets } from './DepositAssets'
export { default as Status } from './Status'

export interface IModalProps {
  visible: boolean
  onClose?(): void
  onOpen?(): void
}
