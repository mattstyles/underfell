
import ndarray from 'ndarray'

const iterate = (mat, cb) => {
  for (let x = 0; x < mat.shape[0]; x++) {
    for (let y = 0; y < mat.shape[1]; y++) {
      let cell = cb(x, y)

      if (cell || cell === 0) {
        mat.set(x, y, cell)
      }
    }
  }
}

export const generate = (u, v) => {
  let grid = new Uint8Array(u * v)
  let mat = ndarray(grid, [u, v])
  iterate(mat, (x, y) => {
    if (x === 0 || x === u - 1 || y === 0 || y === v - 1) {
      return 1
    }
    return 0
  })
  return mat
}
