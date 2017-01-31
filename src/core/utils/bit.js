
import {isArray} from 'lodash/fp'

/**
 * Adds a key/value pair to a mask if not present
 */
const addKey = (k, v) => mask => {
  if (mask[k]) {
    return mask
  }

  mask[k] = v
  return mask
}

/**
 * Generates the bit mask by returning a function that can be passed to an
 * Array.reduce list of strings or arrays|strings. See examples.
 */
const generate = () => {
  let i = 0
  return (mask = {}, arg) => {
    if (typeof arg === 'string') {
      return addKey(arg, Math.pow(2, i++))(mask)
    }

    if (isArray(arg)) {
      return arg.reduce((m, n) => {
        return addKey(n, Math.pow(2, i++))(m)
      }, mask)
    }

    return mask
  }
}

/**
 * Generates an object that can be used for bit mask ops
 * @example
 *   bits(['A', 'B'])
 *   bits('A', 'B')
 *   bits(['A', 'B'], 'C')
 */
export const bits = (...args) => {
  return args.reduce(generate(), {})
}

export const addMask = flag => mask => {
  return flag | mask
}

export const addMasks = flag => (...args) => {
  return args.reduce((f, m) => addMask(f)(m), flag)
}

export const removeMask = flag => mask => {
  return flag ^ mask
}

export const removeMasks = flag => (...args) => {
  return args.reduce((f, m) => removeMask(f)(m), flag)
}

export const hasMask = flag => mask => {
  return flag & mask
}
