
import {find} from 'core/utils'
import {BLOCK_STATES} from 'core/constants/game'

const mineable = (entity, cell) => {
  console.log('You try to mine with your bare hands, not much happens.')
}

const traits = [
  {
    id: 'core:solid',
    create: () => {
      return {
        isSolid: true,
        isOpaque: true
      }
    }
  },
  {
    id: 'core:mineable',
    create: () => {
      return {
        // @TODO what gets passed in here
        onCollision: mineable
      }
    }
  }
]

/**
 * Master immutable block record list
 */
const blocks = [
  {
    id: 'base:wall',
    create: () => {
      return {
        ...trait('core:solid')
      }
    }
  },
  // Stone floor
  {
    id: 'core:stone_floor',
    create: () => {
      return {
        char: '.',
        color: 'rgb(68, 36, 52)',
        isSolid: false,
        isOpaque: false
      }
    }
  },
  // Stone block
  {
    id: 'core:stone_wall',
    create: () => {
      return {
        // Inherits from base:wall
        ...extend('base:wall'),

        ...trait('core:mineable'),

        // Instance members
        char: '#',
        color: 'rgb(133, 149, 161)'
      }
    }
  }
]

/**
 * Block list accessor
 */
const finder = find(blocks)
const traitFinder = find(traits)
const byId = id => item => item.id === id

export const getById = id => {
  return finder(byId(id))
}

export const getTraitById = id => {
  return traitFinder(byId(id))
}

const extend = id => {
  return getById(id).create()
}

const trait = id => {
  return getTraitById(id).create()
}

/**
 * Instance creator
 */
export const factory = {
  /**
   * Creates a new block
   */
  create (id) {
    let block = getById(id)

    return {
      ...block.create(),
      state: BLOCK_STATES.INVISIBLE,
      light: 0
    }
  }
}
