
import {getById as idRef} from 'core/utils'

/**
 * Master immutable block record list
 */
const blocks = [
  {
    id: 0,
    char: ' ',
    color: 'rgb(0, 0, 0)'
  },
  {
    id: 1,
    char: '#',
    color: 'rgb(128, 128, 132)'
  }
]

/**
 * Block list accessor
 */
export const getById = id => {
  return idRef(blocks, id)
}
