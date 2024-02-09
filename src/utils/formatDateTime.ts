import {Temporal} from 'temporal-polyfill'

export const formatDateTime = (dateTime: string) => {
  const targetTimeZone = Temporal.TimeZone.from('Asia/Tokyo')
  const instant = Temporal.Instant.from(dateTime)
  const zoned = instant.toZonedDateTimeISO(targetTimeZone)
  return zoned.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
