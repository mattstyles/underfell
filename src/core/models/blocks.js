
import {find} from 'core/utils'
import {BLOCK_STATES} from 'core/constants/game'

const mineable = (entity, cell) => {
  // @TODO should emit a signal action
  console.log('You try to mine with your bare hands, not much happens.')
}

const noisyFloor = (entity, cell) => {
  console.log('The floor is noisy under your feet.')
}

const squeekyFloor = (entity, cell) => {
  console.log('The floor squeaks as you step off of it.')
}

// @TODO there is a current issue here as adding functions to the definitions,
// and then the map representation, means that the map is no longer serialisable
// which is probably bad. The traits should add handlers only (i.e. turn
// core:solid into a block that should be extended) and any props they need to
// operate and then anything that needs to check should grab the master ref to
// a trait.
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
        onCollision: mineable
      }
    }
  },
  {
    id: 'core:noisy_floor',
    create: () => {
      return {
        onEnter: noisyFloor,
        onExit: squeekyFloor
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
        ...trait('core:noisy_floor'),

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

export const getByIndex = index => blocks[index]

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
