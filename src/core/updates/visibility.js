
import BezierEasing from 'bezier-easing'
import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES, VISIBILITY} from 'core/constants/game'
import {Vector2} from 'mathutil'

const easing = BezierEasing(0, 0, 0, 1)

/**
 * Clears the entire matrix to not visible
 */
export const clearVisibility = mat => {
  return ndIterate(mat, (mat, x, y) => {
    makeCellInvisible(mat.get(x, y))
  })
}

/**
 * Takes a cell and makes it visible if it is currently lighted
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

/**
 * Returns the cell or null if [x, y] is out of bounds
 */
const get = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return null
  }

  return mat.get(x, y)
}

/**
 * Takes a ray and projects it forward, executing the callback as it goes.
 * It'll bail if it hits a solid block, firing the callback on the way out.
 */
const castRay = (mat, ray, light, cb) => {
  // Check for 0 length ray which would create an infinite while
  if (ray.length() <= 0.1) {
    return
  }

  let r = ray
  let [x, y] = light.position

  // Cast the ray by incrementing its magnitude
  while (r.length() < light.magnitude) {
    // Get ray current position
    let [i, j] = r.position()

    // Offset and integerise
    let [u, v] = [
      x + VISIBILITY.ORIGIN_OFFSET + i | 0,
      y + VISIBILITY.ORIGIN_OFFSET + j | 0
    ]

    let cell = get(mat, u, v)
    if (cell) {
      // Pass back the cell, the extent of the raycast and the position
      cb(cell, 1 - (r.length() / light.magnitude), u, v)
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
      makeCellVisible
    )
  }

  // As ray starts at a length of 1 everything inside that region is invisible
  // to the cast. As unit 1 references a discrete cell in our matrix we can just
  // update the light position cell and continue unabated.
  updateCellVisibility(mat, ...char.position)

  return mat
}

/**
 * Feed me a light and I'll populate a light map
 */
const updateLightmap = (mat, light) => {
  let ray = new Vector2(1, 0)

  // Keep track of cells we have already visited and only add light once
  let closed = []

  // Updates the cell with light calculation
  const updateCellLight = (cell, lumination, x, y) => {
    // If we have already visited this cell then we're good to skip it,
    // another light source could visit and up the light level though.
    if (closed.find(cell => cell[0] === x && cell[1] === y)) {
      return
    }

    closed.push([x, y])

    // Clamp luminosity 0.25...1.
    // Apply easing to the luminosity to create a better light falloff.
    // @TODO light describes block opacity currently but better could be
    // to have coloured lights so cell.light would become a magnitude and
    // a colour, the renderer would then perform the blend.
    // @TODO this 0.25 could be extracted to a global, or ambient, light
    // level for all blocks.
    let l = 0.25 + (easing(lumination) * 0.75)

    // Use light addition so that multiple light sources stack
    cell.light += l

    // Clamp saturation to 1
    if (cell.light > 1) {
      cell.light = 1
    }
  }

  for (
    let angle = light.startAngle;
    angle < light.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    castRay(
      mat,
      ray.rotate(angle),
      light,
      updateCellLight
    )
  }

  // Update light source block to be fully lighted
  let source = get(mat, ...light.position)
  if (source) {
    source.light = 1
  }

  return mat
}

/**
 * Work the matrix through all light sources, applying light transforms as
 * we go. Spit out the matrix with the light map applied to it.
 * @TODO can perform a simple distance check based on position towards eye to
 * skip the expensive light calculations altogether, this function will
 * become a bottleneck with many lights so something to reduce the light count
 * should be highly beneficial. The size of the map, i.e. number of DOM elements
 * to manipulate, is a far stronger bottle neck, first optimisations should be
 * put into only updating or rendering parts of maps at a time.
 * @TODO some lighting could also be treated as static i.e. torches could do
 * their light calcs only once, when they are created, updated or destroyed.
 * This would up the complexity though as each block would have to check its
 * light sources to get the correct light level when there is a lighting change.
 */
export const updateLights = (mat, lights) => {
  return lights.reduce(updateLightmap, mat)
}
