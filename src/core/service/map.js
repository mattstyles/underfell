
import ndarray from 'ndarray'
import {ndIterate} from 'core/utils/ndarray'

export const generate = (u, v) => {
  let grid = new Uint8Array(u * v)
  let mat = ndarray(grid, [u, v])
  ndIterate(mat, (mat, x, y) => {
    if (x === 0 || x === u - 1 || y === 0 || y === v - 1) {
      mat.set(x, y, 1)
      return
    }
    mat.set(x, y, 0)
    return
  })
  return mat
}
