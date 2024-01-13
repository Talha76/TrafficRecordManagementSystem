export function* zip(arrays) {
  let iterators = arrays.map(a => a[Symbol.iterator]());
  while (true) {
    let results = iterators.map(it => it.next());
    if (results.some(r => r.done)) return;
    yield results.map(r => r.value);
  }
}
