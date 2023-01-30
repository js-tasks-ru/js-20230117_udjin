/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {

  const arrayKeyAndValue = Object.entries(obj); //Object.entries(obj) – возвращает массив пар [ключ, значение]

  const object = {};

  arrayKeyAndValue.forEach(value => {

    if (fields.includes(value[0])) {
      object[value[0]] = value[1];
    }
  });
  return object;
};


