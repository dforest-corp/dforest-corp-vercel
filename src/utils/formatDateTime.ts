import {DateTime} from 'luxon'

export const formatDateTime = (dateTime: string) => {
  return DateTime.fromISO(dateTime).toFormat('yyyy年LL月dd日', {locale: 'ja'})
}
