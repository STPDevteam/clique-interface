import BigNumber from 'bignumber.js'

export function getPerForAmount(tokenSupply: string | number, amount: string | number | undefined) {
  if (!tokenSupply || !amount) return 0
  return Number(
    new BigNumber(amount)
      .dividedBy(tokenSupply)
      .multipliedBy(100)
      .toFormat(4)
  )
  // const _amount = JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(10000))
  // let ret = JSBI.divide(_amount, JSBI.BigInt(tokenSupply)).toString()
  // ret = (Number(ret) / 100).toFixed(2)
  // return ret
}

export function getAmountForPer(tokenSupply: string | number, per: number | undefined) {
  if (!tokenSupply || !per) return '0'
  return new BigNumber(tokenSupply)
    .multipliedBy(per)
    .dividedBy(100)
    .toFixed(0)
  // const _per = JSBI.BigInt((per * 100).toFixed(0))
  // return JSBI.divide(JSBI.multiply(_per, JSBI.BigInt(tokenSupply)), JSBI.BigInt(10000)).toString()
}

// min 1 up
export function calcTotalAmountValue(amount: number | string | undefined, unitPrice: number | string | undefined) {
  if (!amount || !Number(amount) || !unitPrice) return ''
  const _amount = amount.toString().split('.')[0]
  if (!_amount) return ''
  return new BigNumber(amount).multipliedBy(unitPrice).toFixed(0, 0)
  // const ret = JSBI.divide(
  //   JSBI.multiply(JSBI.BigInt((Number(unitPrice) * 1000000).toFixed()), JSBI.BigInt(_amount)),
  //   JSBI.BigInt(1000000)
  // )
  // return JSBI.GE(ret, JSBI.BigInt(1)) ? ret.toString() : '1'
}

export function getCurrentInputMaxAmount(
  remainderTotal: string,
  exclude: string | number,
  currentInput: string | number
) {
  if (!remainderTotal || !currentInput) return '0'
  const max = new BigNumber(remainderTotal).plus(exclude || 0)
  if (max.gt(currentInput || '0')) return currentInput
  return max.toString()
}

export function getCurrentInputMaxPer(
  tokenSupply: string,
  remainderTotal: string,
  exclude: string | number,
  currentInputPer: number
) {
  if (!remainderTotal || !currentInputPer) return 0
  const amount = getAmountForPer(tokenSupply, currentInputPer)
  const maxAmount = getCurrentInputMaxAmount(remainderTotal, exclude, amount)
  if (new BigNumber(maxAmount).gte(amount)) {
    return currentInputPer
  }
  return getPerForAmount(tokenSupply, maxAmount)
}

export function isValidAmount(value: string | number | undefined) {
  if (!value || !value.toString().trim()) return false
  // .
  const _val = value.toString().split('.')
  if (_val.length > 1) return false
  if (new BigNumber(value).gt(0)) return true
  return false
}

export function calcVotingDuration(day: number, hour: number, minute: number) {
  return day * 86400 + hour * 3600 + minute * 60
}
