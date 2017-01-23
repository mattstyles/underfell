
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

/**
 * Checks that a given point is in bounds
 * @returns <Boolean>
 */
export const checkBounds = (mat, x, y) => {
  if (x < 0 || y < 0) {
    return false
  }

  if (x >= mat.shape[0] || y >= mat.shape[1]) {
    return false
  }

  return true
}
