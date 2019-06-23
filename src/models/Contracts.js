import { is } from "ramda";
import { differenceInDays, format, parse } from "date-fns";
import { defaultContractDate } from "@/utils/date";

export class Contract {
  constructor({
    uuid = null,
    user = null,
    name = null,
    hours = null,
    date = { start: null, end: null }
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.name = is(String, name) ? name : null;
    this.hours = is(Number, hours) ? hours : null;
    this.date = {
      start: is(Date, date.start)
        ? date.start
        : defaultContractDate({ type: "start" }),
      end: is(Date, date.end) ? date.end : defaultContractDate({ type: "end" })
    };
  }

  get start() {
    return parse(this.date.start);
  }

  set start(value) {
    this.date.start = value;
  }

  get end() {
    return parse(this.date.end);
  }

  set end(value) {
    this.date.end = value;
  }

  get duration() {
    return differenceInDays(this.end, this.start);
  }

  get remainingContractDuration() {
    return differenceInDays(this.end, new Date());
  }

  get hoursInMinutes() {
    const [hours, minutes] = this.hours.split(":");

    return hours * 60 + minutes;
  }

  toPayload() {
    return {
      name: this.name,
      hours: this.hoursInMinutes,
      start_date: format(this.start, "YYYY-MM-DD"),
      end_date: format(this.end, "YYYY-MM-DD")
    };
  }
}
