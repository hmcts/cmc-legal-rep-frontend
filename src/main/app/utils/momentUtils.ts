import { Moment } from 'moment'
import * as moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'
/**
 * Gets string (in format 'YYYY-MM-DD') and returns valid moment object for UTC
 */
export function toMoment (date: string): Moment {
  // we must call it this way because https://github.com/moment/moment/issues/717
  // apparently this bug is not properly fixed yet
  return moment.utc(date, DATE_FORMAT)
}
