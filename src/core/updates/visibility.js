
import BezierEasing from 'bezier-easing'
import ndarray from 'ndarray'
import {Vector2, Ray, clamp} from 'mathutil'
import {compose} from 'lodash/fp'

import {ndIterate, checkBounds} from 'core/utils/ndarray'
import {BLOCK_STATES, VISIBILITY} from 'core/constants/game'
import {distance} from 'core/utils'
import {addMasks, removeMask, hasMask} from 'core/utils/bitmask'

const easing = BezierEasing(0, 0, 0, 1)

/**
 * Clears the entire matrix to not visible
 */
export const clearVisibility = map => {
  let mat = ndarray(map.data, [map.width, map.height])
  ndIterate(mat, (mat, x, y) => {
    makeCellInvisible(mat.get(x, y))
  })
  return map
}

/**
 * Takes a cell and makes it visible and discovered if it is currently lighted
 */
const makeCellVisible = cell => {
  if (cell.light > 0) {
    cell.state = addMasks(cell.state)(
      BLOCK_STATES.VISIBLE,
      BLOCK_STATES.DISCOVERED
    )
  }
  // cell.state = BLOCK_STATES.VISIBLE
}

/**
 * Takes a cell and makes it invisible,
 * a previously visible cell will become discovered (i.e. found but not
 * currently visible)
 */
const makeCellInvisible = cell => {
  cell.state = removeMask(cell.state)(BLOCK_STATES.VISIBLE)
  cell.light = 0.25
}

/**
 * Returns if the current cell found at [x, y] blocks vision
 * @returns Boolean
 */
const isBlocker = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return false
  }

  let cell = mat.get(x, y)
  if (!cell) {
    console.warn('no cell', x, y)
    return false
  }

  return hasMask(cell.state)(BLOCK_STATES.OPAQUE)
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
const castRay = options => cb => {
  for (
    let angle = options.startAngle;
    angle < options.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    let dir = Vector2.fromAngle(angle)
    let ray = new Ray(dir)
    let cast = ray.cast({
      origin: [
        options.position[0] + VISIBILITY.ORIGIN_OFFSET,
        options.position[1] + VISIBILITY.ORIGIN_OFFSET
      ],
      magnitude: options.magnitude,
      step: VISIBILITY.RAY_MAG_INC
    })()

    let p = cast.next()
    while (!p.done) {
      // Return integer values to callback
      let result = cb([p.value[0] | 0, p.value[1] | 0])
      if (!result) {
        break
      }

      p = cast.next()
    }
  }
}

/**
 * Give me a vision and I'll set blocks to be visible
 */
export const updateVisibility = vision => map => {
  let mat = ndarray(map.data, [map.width, map.height])

  castRay(vision)(point => {
    let [u, v] = point
    let cell = get(mat, u, v)

    if (cell) {
      makeCellVisible(cell)
    }

    if (isBlocker(mat, u, v)) {
      return false
    }

    return true
  })

  // As ray starts at a length of 1 everything inside that region is invisible
  // to the cast. As unit 1 references a discrete cell in our matrix we can just
  // update the light position cell and continue unabated.
  updateCellVisibility(mat, ...vision.position)

  return map
}

/**
 * Feed me a light source and a matrix and I'll light that matrix right up!
 */
const updateLightmap = (map, light) => {
  let mat = ndarray(map.data, [map.width, map.height])

  // Tracks currently visited cells to ensure this light visits its cells
  // only once. This drastically cuts down the number of checks and allows
  // lighting to work far more easily.
  let closed = []

  // Clamp luminosity 0.25...1.
  // Apply easing to the luminosity to create a better light falloff.
  // @TODO light describes block opacity currently but better could be
  // to have coloured lights so cell.light would become a magnitude and
  // a colour, the renderer would then perform the blend.
  // @TODO this 0.25 could be extracted to a global, or ambient, light
  // level for all blocks.
  function getLuminance (point) {
    let pos = [
      light.position[0] + VISIBILITY.ORIGIN_OFFSET,
      light.position[1] + VISIBILITY.ORIGIN_OFFSET
    ]
    let d = 1 - (distance(point, pos) / light.magnitude)
    // The easing function can get a little funky with non 0...1 values
    if (d < 0) {
      return 0.25
    }
    return clamp(easing(d), 0.25, 1)
  }

  // Adds a light level to the cell referred to by point
  function updateCellLight (u, v) {
    let cell = get(mat, u, v)

    if (!cell) {
      return false
    }

    // Use a for loop as .find is slow
    // Bail if this light has already visited this cell
    for (let i = 0; i < closed.length; i++) {
      let pt = closed[i]
      if (pt[0] === u && pt[1] === v) {
        return false
      }
    }
    closed.push([u, v])

    let l = getLuminance([u, v])
    cell.light += l

    return true
  }

  castRay(light)(point => {
    let [u, v] = point

    updateCellLight(u, v)

    if (isBlocker(mat, u, v)) {
      return false
    }

    return true
  })

  // Update light source block to be fully lighted
  let source = get(mat, ...light.position)
  if (source) {
    source.light = 1
  }

  return map
}

/**
 * Work the matrix through all light sources, applying light transforms as
 * we go. Spit out the matrix with the light map applied to it.
 * We perform a distance check on the light partly to remove unnecessary calcs
 * here but mainly so that the dirty chunks array is accurate, meaning we try
 * to restrict overdraw when we render the map.
 * @TODO some lighting could also be treated as static i.e. torches could do
 * their light calcs only once, when they are created, updated or destroyed.
 * This would up the complexity though as each block would have to check its
 * light sources to get the correct light level when there is a lighting change.
 */
export const updateLights = (lights, vision) => map => {
  return lights
    .filter(light => {
      // Remove lights too far from vision
      return distance(light.position, vision.position) < vision.magnitude + light.magnitude
    })
    .reduce(updateLightmap, map)
}

export const updateSightmap = (lights, vision) => compose(
  updateVisibility(vision),
  updateLights(lights, vision),
  clearVisibility
)
