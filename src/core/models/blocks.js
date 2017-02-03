
import filterObject from 'filter-object'
import {byKey} from 'core/utils'
// import {BLOCK_STATES} from 'core/constants/game'
// import {addMask} from 'core/utils/bit'

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
    isSolid: true,
    isOpaque: true
  },
  {
    id: 'core:mineable',
    onCollision: mineable
  },
  {
    id: 'core:noisy_floor',
    onEnter: noisyFloor,
    onExit: squeekyFloor
  }
]

const getTrait = byKey(traits, 'id')

/**
 * Master immutable block record list
 */
var master = [
  {
    id: 'base:wall',
    traits: [
      'core:solid'
    ]
  },
  // Stone floor
  {
    id: 'core:stone_floor',
    traits: [
      'core:noisy_floor'
    ],
    char: '.',
    color: 'rgb(68, 36, 52)',
    isSolid: false,
    isOpaque: false
  },
  // Stone block
  {
    id: 'core:stone_wall',
    extend: [
      'base:wall'
    ],
    traits: [
      'core:mineable'
    ],
    char: '#',
    color: 'rgb(133, 149, 161)'
  },
  // Fancy wall, for testing really, to see if it will extend from two
  // levels, via core:stone_wall, and also apply core:stone_floor
  {
    id: 'fancy:wall',
    extend: [
      'core:stone_wall',
      'core:stone_floor'
    ],
    char: '$'
  }
]

const getMaster = byKey(master, 'id')

// Creates a block
const createBlock = block => {
  const {traits, extend} = block
  let out = {}

  // Apply traits
  if (traits) {
    out = traits.reduce((b, t) => {
      let trait = getTrait(t)
      if (!trait) {
        return b
      }

      return {
        ...filterObject(trait, ['*', '!id']),
        ...b
      }
    }, out)
  }

  // Apply bases
  if (extend) {
    out = extend.reduce((b, e) => {
      let base = createBlock(getMaster(e))
      if (!base) {
        return b
      }

      return {
        ...filterObject(base, ['*', '!id']),
        ...b
      }
    }, out)
  }

  // Filter extend and traits, which have been dealt with
  return {
    ...out,
    ...filterObject(block, ['*', '!extend', '!traits'])
  }
}

// Can be passed to [].map to create multiple blocks
const createBlocks = block => createBlock

// Process block array to create new instances
var blocks = master.map(createBlocks(master))

/**
 * Grabs the actual object representing a block
 */
export const getBlock = byKey(blocks, 'id')

// console.log(blocks)
// console.log(getBlock('fancy:wall'))

/**
 * Instance creator
 */
export const factory = {
  /**
   * Creates a new block
   */
  create (id) {
    // Creates a minimalist block, ready to store
    return {
      id,
      state: 0,  // no flags set
      light: 0
    }
  }
}
