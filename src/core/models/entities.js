
import {getById as idRef} from 'core/utils'
import {BLOCK_STATES} from 'core/constants/game'

/**
 * Master immutable block record list
 */
const entities = [
  {
    id: 'light',
    char: 'O',
    color: 'rgb(255, 255, 255)',
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
  create (id) {
    return {
      ...getById(id),
      state: BLOCK_STATES.VISIBLE
    }
  }
}
