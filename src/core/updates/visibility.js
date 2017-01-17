
import BezierEasing from 'bezier-easing'
import ndarray from 'ndarray'
import {Vector2, Ray, clamp} from 'mathutil'

import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES, VISIBILITY} from 'core/constants/game'
// import {getChunk, makeDirty, makeClean} from 'core/models/chunks'
import {distance} from 'core/utils'

const easing = BezierEasing(0, 0, 0, 1)

/**
 * Clears the entire matrix to not visible
 */
export const clearVisibility = map => {
  let mat = ndarray(map.data, [map.width, map.height])
  ndIterate(mat, (mat, x, y) => {
    makeCellInvisible(mat.get(x, y))
  })
  // map.chunks.forEach(makeClean)
  return map
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

  let cell = mat.get(x, y)
  if (!cell) {
    console.warn('no cell', x, y)
    return false
  }

  return cell.isSolid
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
 * @deprecated in favour of using Ray.cast and generators
 */
// const castRay = (mat, ray, light, cb) => {
//   // Check for 0 length ray which would create an infinite while
//   if (ray.length() <= 0.1) {
//     return
//   }
//
//   let r = ray
//   let [x, y] = light.position
//
//   // Cast the ray by incrementing its magnitude
//   while (r.length() < light.magnitude) {
//     // Get ray current position
//     let [i, j] = r.position()
//
//     // Offset and integerise
//     let [u, v] = [
//       x + VISIBILITY.ORIGIN_OFFSET + i | 0,
//       y + VISIBILITY.ORIGIN_OFFSET + j | 0
//     ]
//
//     let cell = get(mat, u, v)
//     if (cell) {
//       // Pass back the cell, the extent of the raycast and the position
//       cb(cell, 1 - (r.length() / light.magnitude), u, v)
//     }
//
//     // Perform check to see if this ray should continue casting
//     if (isBlocker(mat, u, v)) {
//       break
//     }
//
//     // Grow ray scalar to increment cast
//     r = r.scalar(VISIBILITY.RAY_MAG_INC)
//   }
// }

/**
 * Flags a chunk as dirty, used when a cell changes to flag to the renderer to
 * redraw this chunk.
 * @deprecated causing big lag spikes for some reason, getChunk uses find??
 * the issue here is that each cell calls a find on the chunk array, which gets
 * slower when querying chunks at the bottom of the list and sometimes gets
 * super slow. maybe if the chunk array was divided into x, y as those values
 * can be calculated from cell [x, y] and chunk dimensions rather than a linear
 * find operation being spammed. a for loop instead of a find might be enough
 * to make this function tolerable speedwise, its necessary to consider as its
 * the only way to get React cranked up to displaying a large number of tiles.
 */
const updateChunk = (chunks, x, y) => {
  return

  // let chunk = getChunk(chunks, x, y)
  // if (!chunk) {
  //   console.warn('no chunk found', x, y)
  //   return chunks
  // }
  // makeDirty(chunk)
  // return chunks
}

/**
 * Feed me a light source and a matrix and I'll light that matrix right up!
 */
export const updateVisibility = (map, char) => {
  let mat = ndarray(map.data, [map.width, map.height])

  for (
    let angle = char.startAngle;
    angle < char.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    let dir = Vector2.fromAngle(angle)
    let ray = new Ray(dir)
    let cast = ray.cast({
      origin: [
        char.position[0] + VISIBILITY.ORIGIN_OFFSET,
        char.position[1] + VISIBILITY.ORIGIN_OFFSET
      ],
      magnitude: char.magnitude,
      step: VISIBILITY.RAY_MAG_INC
    })()

    // Turn into a while loop and terminate either at a blocker
    // or when the ray reaches its angle, i.e. next === false
    // for (let p of cast()) {
    //   let cell = get(mat, p[0] | 0, p[1] | 0)
    //   if (cell) {
    //     // Dummy all light cells to 1, @TODO update lighting calcs
    //     // cell.light = 1
    //
    //     makeCellVisible(cell)
    //     updateChunk(map.chunks, p[0] | 0, p[1] | 0)
    //   }
    // }

    let p = cast.next()
    while (!p.done) {
      let [u, v] = [p.value[0] | 0, p.value[1] | 0]
      let cell = get(mat, u, v)

      if (cell) {
        makeCellVisible(cell)
        updateChunk(map.chunks, u, v)
      }

      if (isBlocker(mat, u, v)) {
        break
      }

      p = cast.next()
    }
  }

  // As ray starts at a length of 1 everything inside that region is invisible
  // to the cast. As unit 1 references a discrete cell in our matrix we can just
  // update the light position cell and continue unabated.
  updateCellVisibility(mat, ...char.position)

  return map
}

/**
 * Feed me a light and I'll populate a light map
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

    updateChunk(map.chunks, u, v)
    return true
  }

  for (
    let angle = light.startAngle;
    angle < light.endAngle;
    angle += VISIBILITY.RAY_ANGLE_INC
  ) {
    let dir = Vector2.fromAngle(angle)
    let ray = new Ray(dir)
    let cast = ray.cast({
      origin: [
        light.position[0] + VISIBILITY.ORIGIN_OFFSET,
        light.position[1] + VISIBILITY.ORIGIN_OFFSET
      ],
      magnitude: light.magnitude,
      step: VISIBILITY.RAY_MAG_INC
    })()

    // Turn into a while loop and terminate either at a blocker
    // or when the ray reaches its angle, i.e. next === false
    // for (let p of cast()) {
    //   updateCellLight(p)
    // }

    let p = cast.next()
    while (!p.done) {
      let [u, v] = [p.value[0] | 0, p.value[1] | 0]

      updateCellLight(u, v)

      if (isBlocker(mat, u, v)) {
        break
      }

      p = cast.next()
    }
  }

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
export const updateLights = (map, lights, vision) => {
  return lights
    .filter(light => {
      // Remove lights too far from vision
      return distance(light.position, vision.position) < vision.magnitude + light.magnitude
    })
    .reduce(updateLightmap, map)
}
