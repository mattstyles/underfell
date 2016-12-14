
/**
 * Various helpers for dealing with the array of entities
 */

export const getEntityById = (arr, id) => {
  return arr.find(entity => entity.id === id)
}
