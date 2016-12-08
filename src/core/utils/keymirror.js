
import {isArray} from 'lodash/fp'

const keyed = ns => {
  const keyMap = (map, key) => {
    if (typeof key === 'string') {
      map[key] = `${ns}:${key}`
      return map
    }

    if (isArray(key)) {
      return key.reduce(keyMap, map)
    }

    if (typeof key === 'object') {
      return Object
        .keys(key)
        .filter(k => key[k])
        .reduce(keyMap, map)
    }

    return map
  }

  return keyMap
}

const keyMirror = (...args) => {
  return args.reduce(keyed('NS'), {})
}

export default keyMirror
