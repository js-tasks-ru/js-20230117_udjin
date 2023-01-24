/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {

  const arrayKeyAndValue = Object.entries(obj); //Object.entries(obj) – возвращает массив пар [ключ, значение]

  const object = {};

  arrayKeyAndValue.forEach(value => {

    if (!fields.includes(value[0])) {
      object[value[0]] = value[1];
    }
  });
  return object;
};
