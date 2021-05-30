export function getByProperty(arr, val, prop = 'id') {
  // this is exactly like findById(arr, val) if the prop parameter isn't specified
  return arr.filter(obj => obj[prop] === val)[0];
}

export function relocateItemInArray(arr, oldIndex, newIndex) {
  /*
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  */

  // Here's a much more complicated, but more memory efficient (faster) one I found online:
  let i, tmp;
  oldIndex = parseInt(oldIndex, 10);
  newIndex = parseInt(newIndex, 10);

  if (oldIndex !== newIndex && 0 <= oldIndex && oldIndex <= arr.length && 0 <= newIndex && newIndex <= arr.length) {
    tmp = arr[oldIndex];
    if (oldIndex < newIndex) {
      for (i = oldIndex; i < newIndex; i++) {
        arr[i] = arr[i + 1];
      }
    }
    else {
      for (i = oldIndex; i > newIndex; i--) {
        arr[i] = arr[i - 1];
      }
    }
    arr[newIndex] = tmp;
  }

  return arr;
}

export function shuffleArray(array) {
  for (let i = (array.length - 1); i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const base62 = {
  charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  encode: integer => {
    if (integer === 0) return 0;

    let s = [];
    while (integer > 0) {
      s = [base62.charset[integer % 62], ...s];
      integer = Math.floor(integer / 62);
    }
    return s.join('');
  },
  decode: chars => chars.split('').reverse().reduce((prev, curr, i) => prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
};