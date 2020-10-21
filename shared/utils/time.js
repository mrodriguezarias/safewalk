import moment from "moment/min/moment-with-locales"
import generalUtils from "./general"

const timeUtils = {
  getRelativeTime: (time) => {
    let relativeTime = generalUtils.capitalize(
      moment(time).locale("es").fromNow(),
    )
    if (relativeTime === "Hace unos segundos") {
      relativeTime = "Recién"
    }
    return relativeTime
  },
  getTimeDifference: (time1, time2) => {
    const moment1 = moment(time1)
    const moment2 = moment(time2)
    const duration = moment.duration(Math.abs(moment1.diff(moment2)))
    return generalUtils.capitalize(duration.locale("es").humanize())
  },
}

export default timeUtils
