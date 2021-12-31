import JSBI from 'jsbi'
import moment from 'moment'
import toFormat from 'toformat'
import _Big from 'big.js'
// import BigNumber from 'bignumber.js'

export function timeStampToFormat(timeStamp: number | Date | undefined, format = 'Y-M-D h:m:s') {
  if (!timeStamp) return '--'
  if (timeStamp instanceof Date) {
    return moment(timeStamp).format(format)
  }
  timeStamp = timeStamp.toString().length <= 10 ? timeStamp * 1000 : timeStamp
  return moment(timeStamp).format(format)
}

export function getPerForAmount(tokenSupply: string | number, amount: string | number | undefined) {
  if (!tokenSupply || !amount) return ''
  const _amount = JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(10000))
  let ret = JSBI.divide(_amount, JSBI.BigInt(tokenSupply)).toString()
  ret = (Number(ret) / 100).toFixed(2)
  return ret
}

export function getAmountForPer(tokenSupply: string | number, per: number | undefined) {
  if (!tokenSupply || !per) return '0'
  const _per = JSBI.BigInt((per * 100).toFixed(0))
  return JSBI.divide(JSBI.multiply(_per, JSBI.BigInt(tokenSupply)), JSBI.BigInt(10000)).toString()
}

// min 1
export function calcTotalAmount(amount: number | string | undefined, unitPrice: number | string | undefined) {
  if (!amount || !Number(amount) || !unitPrice) return ''
  const _amount = amount.toString().split('.')[0]
  if (!_amount) return ''
  const ret = JSBI.divide(
    JSBI.multiply(JSBI.BigInt((Number(unitPrice) * 1000000).toFixed()), JSBI.BigInt(_amount)),
    JSBI.BigInt(1000000)
  )
  console.log(JSBI.divide(JSBI.BigInt(10), JSBI.BigInt(3)).toString())
  return JSBI.GE(ret, JSBI.BigInt(1)) ? ret.toString() : '1'
}

export function toFormatGroup(n: number | string, fixed = 2): string {
  const Big = toFormat(_Big)
  const x = new Big(n || 0)
  return x.toFormat(fixed)
}

export function toFormatMillion(n: number | string) {
  const _n = JSBI.BigInt((Number(n) * 10000).toFixed(0))
  if (JSBI.GE(_n, JSBI.BigInt(10000000000))) {
    return toFormatGroup(Number(JSBI.divide(_n, JSBI.BigInt(100000000)).toString()) / 100) + 'M'
  }
  const _ret = toFormatGroup(n)
  if (isNaN(Number(_ret))) {
    const _arr = _ret.split(',')
    const _end = _arr.splice(_arr.length - 1, 1)
    return _arr.join(',') + `,${Number(_end)}`
  }
  return Number(_ret)
}
