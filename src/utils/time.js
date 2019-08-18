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

  return format === "hm" ? `${hours}h${minutes}m` : `${hours}:${minutes}`;
}
