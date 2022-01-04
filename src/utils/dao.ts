import JSBI from 'jsbi'
import moment from 'moment'
import toFormat from 'toformat'
import _Big from 'big.js'

export function timeStampToFormat(timeStamp: number | Date | undefined, format = 'Y-M-D h:m:s') {
  if (!timeStamp) return '--'
  if (timeStamp instanceof Date) {
    return moment(timeStamp).format(format)
  }
  timeStamp = timeStamp.toString().length <= 10 ? timeStamp * 1000 : timeStamp
  return moment(timeStamp).format(format)
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

export function amountAddDecimals(amount: string, decimals = 18) {
  return amount + new Array(decimals).fill('0').join('')
}
