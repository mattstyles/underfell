
/**
 * Iterates over the array passing back the x, y values and the array itself
 */
export const ndIterate = (mat, cb) => {
  for (let x = 0; x < mat.shape[0]; x++) {
    for (let y = 0; y < mat.shape[1]; y++) {
      cb(mat, x, y)
    }
  }
  return mat
}

/**
 * ndarray map function
 */
export const ndMap = (mat, cb) => {
  let mapped = []
  ndIterate(mat, function () {
    mapped.push(cb(...arguments))
  })
  return mapped
}
