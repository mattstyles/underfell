
import FastSimplexNoise from 'fast-simplex-noise'
import seedrandom from 'seedrandom'
import ndarray from 'ndarray'
import {ndIterate} from 'core/utils/ndarray'
import {factory as blockFactory} from 'core/models/blocks'
import {factory as chunkFactory} from 'core/models/chunks'
import {SIZES} from 'core/constants/game'

// import data from '../../../map.json'

const generateEdges = (mat, x, y) => {
  let [u, v] = mat.shape
  if (x === 0 || x === u - 1 || y === 0 || y === v - 1) {
    mat.set(x, y, blockFactory.create('core:stone_wall'))
    return true
  }
  return false
}

// const generateRandom = (mat, x, y) => {
//   mat.set(x, y, blockFactory.create(Math.random() < 0.3
//     ? 'core:stone_wall'
//     : 'core:stone_floor'
//   ))
//   return true
// }

// const generateMap = (mat, x, y) => {
//   for (let y = 0; y < mat.shape[1]; y++) {
//     let x = 0
//     data[y].split('').forEach(cell => {
//       mat.set(x, y, blockFactory.create(cell | 0))
//       ++x
//     })
//   }
// }

const generateSimplex = (mat, key) => {
  const rng = seedrandom(key || 'hello')
  const noise = new FastSimplexNoise({
    max: 1,
    min: 0,
    octaves: 8,
    amplitude: 1,
    frequency: 0.075,
    persistence: 0.5,
    random: rng
  })
  return (x, y) => {
    let cell = blockFactory.create(noise.scaled([x, y]) < 0.5
      ? 'core:stone_floor'
      : 'core:stone_wall'
    )
    mat.set(x, y, cell)
    return true
  }
}

export const generate = (u, v, key) => {
  let data = new Array(u * v)
  let mat = ndarray(data, [u, v])
  let simplex = generateSimplex(mat, key)

  // Generate map
  ndIterate(mat, (mat, x, y) => {
    if (generateEdges(mat, x, y)) return
    // if (generateRandom(mat, x, y)) return
    if (simplex(x, y)) return
    return
  })

  // generateMap(mat, x, y)

  // Generate chunk map
  let chunks = []
  for (let i = 0; i < u; i += SIZES.CHUNK_WIDTH) {
    for (let j = 0; j < v; j += SIZES.CHUNK_HEIGHT) {
      chunks.push(chunkFactory.create({
        translate: [i, j]
      }))
    }
  }

  return {
    data,
    width: u,
    height: v,
    chunks
  }
}

export const produceChunkData = (mat) => {

}
