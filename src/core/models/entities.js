
import {getById as idRef} from 'core/utils'

/**
 * Master immutable block record list
 */
const entities = [
  {
    id: 'char',
    char: '@',
    color: 'rgb(218, 212, 94)',
    z: 120
  },
  {
    id: 'light',
    char: 'O',
    color: 'rgb(133, 149, 161)',
    startAngle: 0,
    endAngle: Math.PI * 2,
    magnitude: 2
  }
]

/**
 * Entity list accessor
 */
export const getById = id => {
  return idRef(entities, id)
}

/**
 * Instance creator
 */
export const factory = {
  create (id, pos) {
    return {
      ...getById(id),
      position: pos
    }
  }
}
