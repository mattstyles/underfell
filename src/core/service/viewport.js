
/**
 * Handles viewport functions
 */

import {SIZES} from 'core/constants/game'
import {clamp} from 'mathutil'

/**
 * @param mat <ndarray> describing the map, used for bounds
 * @param x <Integer> x location of entity to center on
 * @param y <Integer> y location of entity to center on
 * @returns [x1, y1, x2, y2] rect describing the viewport
 */
export const getViewport = (mat, x, y) => {
  const max = [mat.shape[0] - SIZES.VIEWPORT_WIDTH, mat.shape[1] - SIZES.VIEWPORT_HEIGHT]
  const half = [SIZES.VIEWPORT_WIDTH * 0.5, SIZES.VIEWPORT_HEIGHT * 0.5]
  const origin = [
    clamp(x - half[0], 0, max[0]),
    clamp(y - half[1], 0, max[1])
  ]

  return [
    origin[0],
    origin[1],
    origin[0] + SIZES.VIEWPORT_WIDTH,
    origin[1] + SIZES.VIEWPORT_HEIGHT
  ]
}
