
import {getById as idRef} from 'core/utils'
import {BLOCK_STATES} from 'core/constants/game'

/**
 * Master immutable block record list
 */
const blocks = [
  // Stone floor
  {
    id: 0,
    char: '.',
    color: 'rgb(68, 36, 52)',
    isSolid: false,
    isOpaque: false
  },
  // Stone block
  {
    id: 1,
    char: '#',
    color: 'rgb(133, 149, 161)',
    isSolid: true,
    isOpaque: true
  }
]

/**
 * Block list accessor
 */
export const getById = id => {
  return idRef(blocks, id)
}

/**
 * Instance creator
 */
export const factory = {
  create (id) {
    return {
      ...getById(id),
      state: BLOCK_STATES.INVISIBLE,
      light: 0
    }
  }
}
