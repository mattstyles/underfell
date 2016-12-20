
import ndarray from 'ndarray'
import {ndIterate} from 'core/utils/ndarray'
import {factory} from 'core/models/blocks'

import data from '../../../map.json'

export const generate = (u, v) => {
  let grid = new Array(u * v)
  let mat = ndarray(grid, [u, v])

  ndIterate(mat, (mat, x, y) => {
    if (x === 0 || x === u - 1 || y === 0 || y === v - 1) {
      mat.set(x, y, factory.create(1))
      return
    }

    if (x === 2 && y === 1) {
      mat.set(x, y, factory.create(1))
      return
    }

    if (x === 2 && y === 2) {
      mat.set(x, y, factory.create(1))
      return
    }

    if (x === 2 && y === 3) {
      mat.set(x, y, factory.create(1))
      return
    }

    mat.set(x, y, factory.create(Math.random() < 0.3 ? 1 : 0))
    return
  })

  // for (let y = 0; y < mat.shape[1]; y++) {
  //   let x = 0
  //   data[y].split('').forEach(cell => {
  //     mat.set(x, y, factory.create(cell | 0))
  //     ++x
  //   })
  // }

  return mat
}
