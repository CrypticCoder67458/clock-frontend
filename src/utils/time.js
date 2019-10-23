Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export function minutesToHHMM(min, format) {
  const hours = Math.floor(min / 60).pad(2);
  const minutes = (min % 60).pad(2);

  return format === "hm" ? `${hours}h ${minutes}m` : `${hours}:${minutes}`;
}

export function startEndHours(date) {
  const start = new Date(date);
  const end = new Date(date);
  const hours = date.getHours();

  if (hours === 0) {
    // At the beginning of the day, go one hour to the front.
    start.setHours(0);
    end.setHours(1);
  } else if (hours == 23) {
    // At the end of the day, go one hour back from the last possible time.
    start.setHours(22);
    start.setMinutes(59);
    end.setHours(23);
    end.setMinutes(59);
  } else {
    // At any other point of the day, set the start one hour in the past.
    const hour = end.getHours();
    start.setHours(hour - 1);
  }

  return {
    start,
    end
  };
}
