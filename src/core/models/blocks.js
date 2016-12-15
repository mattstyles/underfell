
import {getById as idRef} from 'core/utils'
import {BLOCK_STATES} from 'core/constants/game'

/**
 * Master immutable block record list
 */
const blocks = [
  {
    id: 0,
    char: '.',
    color: 'rgb(68, 36, 52)'
  },
  {
    id: 1,
    char: '#',
    color: 'rgb(133, 149, 161)'
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
      state: BLOCK_STATES.VISIBLE  // @TODO for now all blocks start visible
    }
  }
}
