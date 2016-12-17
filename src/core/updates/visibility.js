
import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES, VISIBILITY} from 'core/constants/game'
import {Vector2} from 'mathutil'

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
  if (cell.light > 0) {
    cell.state = BLOCK_STATES.VISIBLE
  }
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

  cell.light = 0
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

const get = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return null
  }

  return mat.get(x, y)
}

/**
 * Takes a ray and projects it forward, lighting cells as it goes.
 * It'll bail if it hits a light blocker, lighting that blocker on the way out.
 */
const castRay = (mat, ray, light, cb) => {
  // Check for 0 length ray which would create an infinite while
  if (ray.length() <= 0.1) {
    return
  }

  let r = ray
  let [x, y] = light.position
  let closed = []

  // Cast the ray by incrementing its magnitude
  while (r.length() < light.magnitude) {
    // Get ray current position
    let [i, j] = r.position()

    // Offset and integerise
    let [u, v] = [
      x + VISIBILITY.ORIGIN_OFFSET + i | 0,
      y + VISIBILITY.ORIGIN_OFFSET + j | 0
    ]

    // Update visibility of cell
    let cell = get(mat, u, v)
    if (cell) {
      // Pass back the cell and the extent of the ray
      cb(cell, 1 - (r.length() / light.magnitude))
    }

    // Perform check to see if this ray should continue casting
    if (isBlocker(mat, u, v)) {
      break
    }

    // Grow ray scalar to increment cast
    r = r.scalar(VISIBILITY.RAY_MAG_INC)
  }
}

/**
 * Feed me a light source and a matrix and I'll light that matrix right up!
 */
export const updateVisibility = (mat, char) => {
  let ray = new Vector2(1, 0)

  for (
    let angle = char.startAngle;
    angle < char.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    castRay(
      mat,
      ray.rotate(angle),
      char,
      (cell) => {
        makeCellVisible(cell)
      }
    )
  }

  // As ray starts at a length of 1 everything inside that region is invisible
  // to the cast. As unit 1 references a discrete cell in our matrix we can just
  // update the light position cell and continue unabated.
  updateCellVisibility(mat, ...char.position)

  return mat
}

export const updateLightmap = (mat, light) => {
  let ray = new Vector2(1, 0)

  for (
    let angle = light.startAngle;
    angle < light.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    castRay(
      mat,
      ray.rotate(angle),
      light,
      (cell, lumination) => {
        // Clamp luminosity 0.25...1
        // @TODO use a bezier here to make the light brighter close in
        // and then drop off
        let l = 0.25 + (lumination * 0.75)
        cell.light = l

        // Can we use light addition?
        // cell.light += l

        // Clamp to 1
        if (cell.light > 1) {
          cell.light = 1
        }
      }
    )
  }

  // Might need to make light source opacity 1
  let source = get(mat, ...light.position)
  if (source) {
    source.light = 1
  }

  return mat
}
