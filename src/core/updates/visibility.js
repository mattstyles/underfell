
import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES, VISIBILITY} from 'core/constants/game'
import {Vector2, Point, lerp} from 'mathutil'

/**
 * Clears the entire matrix to not visible
 */
export const clearVisibility = mat => {
  return ndIterate(mat, (mat, x, y) => {
    makeCellInvisible(mat.get(x, y))
  })
}

/**
 * Takes a cell and makes it visible
 */
const makeCellVisible = cell => {
  cell.state = BLOCK_STATES.VISIBLE
}

/**
 * Takes a cell and makes it invisible,
 * a previously visible cell will become discovered (i.e. found but not
 * currently visible)
 */
const makeCellInvisible = cell => {
  cell.state = cell.state === BLOCK_STATES.INVISIBLE
    ? BLOCK_STATES.INVISIBLE
    : BLOCK_STATES.DISCOVERED
}

const checkBounds = (mat, x, y) => {
  if (x < 0 || y < 0) {
    return false
  }

  if (x >= mat.shape[0] || y >= mat.shape[1]) {
    return false
  }

  return true
}

const get = (mat, x, y) => {
  const i = x | 0
  const j = y | 0
  return checkBounds(mat, i, j)
    ? mat.get(i, j)
    : null
}

const isLineBlocked = (mat, line) => {
  // let c = get(mat, line.x, line.y)
  // if (c && c.isSolid) {
  //   return false
  // }
  let count = []

  for (let i = 0; i <= 1; i += 0.1) {
    let [x, y] = [lerp(i, line.origin.x, line.head.x), lerp(i, line.origin.y, line.head.y)]
    let cell = get(mat, x, y)
    if (cell && cell.isSolid) {
      insert(count, {x: x | 0, y: y | 0})
    }
  }

  return count.length
}

const insert = (map, point) => {
  if (map.find(p => p.x === point.x && p.y === point.y)) {
    return
  }

  map.push(point)
}

const MAG = 3

const checkLine = (mat, line) => {
  if (line.length() > MAG * 1.1) {
    return false
  }

  if (isLineBlocked(mat, line) > 1) {
    return false
  }

  return true
}

const generateLightMap = (mat, lights) => {
  let map = []

  lights.forEach(light => {
    const origin = new Point(light.position[0] + 0.5, light.position[1] + 0.5)
    for (let i = -MAG; i <= MAG; i++) {
      for (let j = -MAG; j <= MAG; j++) {
        let head = new Point(origin.x + i, origin.y + j)
        let line = new Vector2({
          head,
          origin
        })

        // Quick check that candidate isn't too far away
        if (checkLine(mat, line)) {
          insert(map, line)
        }
      }
    }
  })

  return map
}

/**
 * Feed me a light source and a matrix and I'll light that matrix right up!
 */
export const updateVisibility = (mat, origin, lights) => {

  // Calculate light map, which denotes candidates for visibility
  let lightmap = generateLightMap(mat, lights)

  // console.log(lightmap)

  lightmap.forEach(block => {
    let cell = get(mat, block.x, block.y)
    if (!cell) {
      return
    }

    makeCellVisible(cell)
  })

  return mat
}
