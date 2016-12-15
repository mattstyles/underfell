
import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES} from 'core/constants/game'
import {Point, Vector2, toRadians} from 'mathutil'

const ORIGIN_OFFSET = 0.5
const RAY_ANGLE_INC = toRadians(5)
const RAY_MAG_INC = 0.1
const RAY_MAX_LENGTH = 4
const RAY_MAX_TURN = toRadians(360)

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

/**
 * Straight forward matrix bounds checker to stop access errors
 */
const checkBounds = (mat, x, y) => {
  if (x < 0 || y < 0) {
    return false
  }

  if (x >= mat.shape[0] || y >= mat.shape[1]) {
    return false
  }

  return true
}

// @deprecated
// const updateCell = (mat, x, y) => {
//   if (!checkBounds(mat, x, y)) {
//     return
//   }
//
//   makeCellVisible(mat.get(x, y))
// }

/**
 * Returns if the current cell found at [x, y] blocks vision
 * @returns Boolean
 */
const isBlocker = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return false
  }

  return mat.get(x, y).isSolid
}

/**
 * Sets the cell at [x, y] to visible
 */
const updateCellVisibility = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return
  }

  makeCellVisible(mat.get(x, y))
}

/**
 * Takes a ray and projects it forward, lighting cells as it goes.
 * It'll bail if it hits a light blocker, lighting that blocker on the way out.
 */
const castRay = (mat, ray, origin) => {
  // Check for 0 length ray which would create an infinite while
  if (ray.length() <= 0.5) {
    return
  }

  let s = 1
  let r = ray

  // Cast the ray by incrementing its magnitude
  while (r.length() < RAY_MAX_LENGTH) {
    // Get ray current position
    let [i, j] = r.position()

    // Offset by origin and integerise
    let [u, v] = [origin.x + i | 0, origin.y + j | 0]

    // Update visibility of cell
    updateCellVisibility(mat, u, v)

    // Perform check to see if this ray should continue casting
    if (isBlocker(mat, u, v)) {
      break
    }

    // Grow ray scalar to increment cast
    s += RAY_MAG_INC
    r = ray.scalar(s)
  }
}

/**
 * Feed me a light source and a matrix and I'll light it right up!
 */
export const updateVisibility = (mat, char) => {
  let [x, y] = char.position
  let ray = new Vector2(1, 0)

  for (let angle = toRadians(0); angle < RAY_MAX_TURN; angle += RAY_ANGLE_INC) {
    castRay(mat, ray.rotate(angle), new Point(x + ORIGIN_OFFSET, y + ORIGIN_OFFSET))
  }

  return mat
}
