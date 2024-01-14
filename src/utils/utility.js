export function* zip(arrays) {
  let iterators = arrays.map(a => a[Symbol.iterator]());
  while (true) {
    let results = iterators.map(it => it.next());
    if (results.some(r => r.done)) return;
    yield results.map(r => r.value);
  }
}

export function printableDateTime(dateTime) {
  return dateTime.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
