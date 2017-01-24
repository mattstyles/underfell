
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

/**
 * Provide a matrix and a comparison function and you'll get back a function
 * that can be used to query the matrix for a given position. Expects that
 * function returns a boolean but does not enforce it, note that out of bounds
 * checks _will_ return false.
 */
export const compare = (mat, fn) => (x, y) => {
  if (!checkBounds(mat, x, y)) {
    return false
  }

  let cell = mat.get(x, y)
  if (!cell) {
    console.warn('no cell', x, y)
    return false
  }

  return fn(cell)
}
