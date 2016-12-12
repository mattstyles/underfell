
import {isArray} from 'lodash/fp'

const genKey = (ns, key) => {
  if (!ns) {
    return key
  }

  return `${ns}:${key}`
}

const keyed = ns => {
  const keyMap = (map, key) => {
    if (typeof key === 'string') {
      map[key] = genKey(ns, key)
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
  let key = args.slice(0, 1)[0]
  if (typeof key !== 'string') {
    return args.reduce(keyed(), {})
  }
  return args.slice(1).reduce(keyed(key), {})
}

export default keyMirror
