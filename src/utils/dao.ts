import moment from 'moment'
import toFormat from 'toformat'
import _Big from 'big.js'

export function isDaoframeSite() {
  return process.env.NODE_ENV === 'daoframe'
}
export function isMycliqueSite() {
  return process.env.NODE_ENV === 'myclique'
}
export function isDevSite() {
  return process.env.NODE_ENV === 'development'
}

export function timeStampToFormat(timeStamp: number | Date | undefined, format = 'Y-MM-DD HH:mm:ss') {
  if (!timeStamp) return '--'
  if (timeStamp instanceof Date) {
    return moment(timeStamp).format(format)
  }
  timeStamp = timeStamp.toString().length <= 10 ? timeStamp * 1000 : timeStamp
  return moment(timeStamp).format(format)
}

export function toFormatGroup(n: number | string, fixed = 0): string {
  const Big = toFormat(_Big)
  const x = new Big(n || 0)
  return x.toFormat(fixed)
}

// export function toFormatMillion(n: number | string) {
//   if (!n) return ''
//   if (isNaN(Number(n))) return ''
//   const _n = JSBI.BigInt((Number(n) * 10000).toFixed(0))
//   if (JSBI.GE(_n, JSBI.BigInt(10000000000))) {
//     return toFormatGroup(Number(JSBI.divide(_n, JSBI.BigInt(100000000)).toString()) / 100, 2) + 'M'
//   }
//   return toFormatGroup(n, 0)
// }

export function amountAddDecimals(amount: string, decimals = 18) {
  return amount + new Array(decimals).fill('0').join('')
}

export function getCurrentTimeStamp() {
  return Number((new Date().getTime() / 1000).toFixed())
}

export function titleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

export function shortenHashAddress(hash: string, chars = 4): string {
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`
}
