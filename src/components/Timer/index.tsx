import { useEffect, useMemo, useState } from 'react'

const formatTime = (h: number, m: number, s: number) => `${h}h:${m}m:${s}s`

export const getDeltaTime = (time: number, to = Date.now()) => {
  const correctedTime = time * 1000
  const delta = /*14*24*60*60*1000 -*/ (correctedTime - to) / 1000

  return delta > 0 ? delta : 0
}

export const toDeltaTimer = (delta: number) => {
  // const d = Math.floor(delta / (60 * 60 * 24))
  const h = Math.floor((delta / (60 * 60)) % 24)
  const m = Math.floor((delta / 60) % 60)
  const s = Math.floor(delta % 60)
  return formatTime(h, m, s)
}

export const toDeltaNumberTimer = (delta: number) => {
  // const d = Math.floor(delta / (60 * 60 * 24))
  const h = Math.floor((delta / (60 * 60)) % 24)
  const m = Math.floor((delta / 60) % 60)
  const s = Math.floor(delta % 60)
  return `${h <= 9 ? `0${h}` : h} : ${m <= 9 ? `0${m}` : m} : ${s <= 9 ? `0${s}` : s}`
}

export const Timer = ({
  timer,
  onZero,
  onlyNumber,
  onHeartbeat,
  showDay
}: {
  timer: number
  onZero?: () => void
  onlyNumber?: boolean
  onHeartbeat?: (number: number) => void
  showDay?: boolean
}) => {
  const [time, setTime] = useState(getDeltaTime(timer))
  onHeartbeat && onHeartbeat(time)

  useEffect(() => {
    const tm = setInterval(() => {
      setTime(getDeltaTime(timer))
    }, 1000)
    return () => clearInterval(tm)
  }, [timer])

  const days = useMemo(() => {
    return showDay ? Math.floor(time / 86400) + 'd ' : ''
  }, [time, showDay])

  useEffect(() => {
    if (!time) {
      onZero && onZero()
    }
  }, [time, onZero])

  if (onlyNumber) {
    return (
      <>
        {days}
        {toDeltaNumberTimer(time)}
      </>
    )
  }
  return (
    <>
      {days}
      {toDeltaTimer(time)}
    </>
  )
}
