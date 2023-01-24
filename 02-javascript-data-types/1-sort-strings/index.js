/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @param {string} a
 * @param {string} b
 * @param {string} mode
 * @returns {string[]}
 */
function comparator(a, b) {
  return a.localeCompare(b, 'ru', { sensitivity: 'variant', caseFirst: 'upper' });
}

function comparatorR(a, b) {
  return b.localeCompare(a, 'ru', { sensitivity: 'variant', caseFirst: 'upper' });
}

export function sortStrings(arr, param = 'asc') {

  const nArr = [...arr];

  if (param === 'asc') {
    return nArr.sort(comparator);
  }

  return nArr.sort(comparatorR);
}
