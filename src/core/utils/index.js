
import {euclidean} from 'mathutil'

/**
 * Expects an array of objects with an id prop
 */
export const getById = (arr, id) => {
  return arr.find(item => item.id === id)
}

/**
 * Rect helper class
 */
export class Rect {
  constructor (p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }

  /**
   * Expects point to be of type [x, y]
   * @returns <Boolean>
   */
  containsPoint (point) {
    return point[0] >= this.p1[0] &&
      point[0] <= this.p2[0] &&
      point[1] >= this.p1[1] &&
      point[1] <= this.p2[1]
  }

  /**
   * Checks for overlaps between rects
   */
  overlaps (rect) {
    return this.containsPoint([rect.p1[0], rect.p1[1]]) ||
      this.containsPoint([rect.p2[0], rect.p2[1]]) ||
      this.containsPoint([rect.p2[0], rect.p1[1]]) ||
      this.containsPoint([rect.p1[0], rect.p2[1]])
  }

  inspect () {
    return [this.p1[0], this.p1[1], this.p2[0], this.p2[1]]
  }
}

/**
 * Distance helper for two points
 */
export const distance = (p1, p2) => {
  return Math.abs(euclidean(p1, p2))
}

/**
 * noop
 */
export function noop () {}
