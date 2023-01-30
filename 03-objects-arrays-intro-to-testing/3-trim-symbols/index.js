/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  const arraySymbols = string.split('');
  let newString = '';
  let i = 0;
  let counter = 1;


  if (size === 0) return newString;

  while (i < arraySymbols.length) {
    while (arraySymbols[i] === arraySymbols[i + 1] && (counter >= size)) {
      i++;
      counter++;
    }

    newString += arraySymbols[i];

    if (arraySymbols[i] === arraySymbols[i + 1]) {
      counter++;
    }
    else {
      counter = 1;
    }
    i++;
  }

  return newString;
}

