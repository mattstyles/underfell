
/**
 * Expects an array of objects with an id prop
 */
export const getById = (arr, id) => {
  return arr.find(item => item.id === id)
}
