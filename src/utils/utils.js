export function getByProperty(arr, val, prop = 'id') {
  // this is exactly like findById(arr, val) if the prop parameter isn't specified
  return arr.filter(obj => obj[prop] === val)[0];
}