export function swapObject (obj: object): object {
  return Object.keys(obj).reduce((swapped, key) => {
    swapped[obj[key]] = key
    return swapped
  }, {})
}
