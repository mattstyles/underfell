
import FastSimplexNoise from 'fast-simplex-noise'
import seedrandom from 'seedrandom'
import ndarray from 'ndarray'
import {ndIterate} from 'core/utils/ndarray'
import {factory} from 'core/models/blocks'

import data from '../../../map.json'

const generateEdges = (mat, x, y) => {
  let [u, v] = mat.shape
  if (x === 0 || x === u - 1 || y === 0 || y === v - 1) {
    mat.set(x, y, factory.create(1))
    return true
  }
  return false
}

const generateRandom = (mat, x, y) => {
  mat.set(x, y, factory.create(Math.random() < 0.3 ? 1 : 0))
  return true
}

const generateMap = (mat, x, y) => {
  for (let y = 0; y < mat.shape[1]; y++) {
    let x = 0
    data[y].split('').forEach(cell => {
      mat.set(x, y, factory.create(cell | 0))
      ++x
    })
  }
}

const generateSimplex = (mat, x, y) => {
  const rng = seedrandom('hello')
  const noise = new FastSimplexNoise({
    max: 1,
    min: 0,
    octaves: 4,
    amplitude: 0.2,
    frequency: 0.1,
    persistence: 0.5,
    random: rng
  })
  let cell = factory.create(noise.scaled([x, y]) < 0.55 ? 0 : 1)
  mat.set(x, y, cell)
  return true
}

export const generate = (u, v) => {
  let grid = new Array(u * v)
  let mat = ndarray(grid, [u, v])

  ndIterate(mat, (mat, x, y) => {
    if (generateEdges(mat, x, y)) return
    // if (generateRandom(mat, x, y)) return
    if (generateSimplex(mat, x, y)) return
    return
  })

  // generateMap(mat, x, y)

  return mat
}
