
import filterObject from 'filter-object'
import {byKey} from 'core/utils'
import {addMasks} from 'core/utils/bitmask'

import master from './core/blocks'
import traits from './core/traits'

const getTrait = byKey(traits, 'id')
const getMaster = byKey(master, 'id')

/**
 * @param b {object} the block object to apply the trait to
 * @param t {string} the string representation of the trait
 */
const applyTrait = (b, t) => {
  let trait = getTrait(t)
  if (!trait) {
    return b
  }

  if (trait.state) {
    let state = b.state || 0
    b.state = addMasks(state)(state, trait.state)
  }

  return {
    ...filterObject(trait, ['*', '!id']),
    ...b
  }
}

/**
 * @param b {object} the block object to apply the trait to
 * @param e {string} the string representation of the base to extend
 */
const applyBase = (b, e) => {
  let base = createBlock(getMaster(e))
  if (!base) {
    return b
  }

  if (base.state) {
    let state = b.state || 0
    b.state = addMasks(state)(state, base.state)
  }

  return {
    ...filterObject(base, ['*', '!id']),
    ...b
  }
}

// Creates a block
// @TODO beware circular refs, they'll currently loop
const createBlock = block => {
  const {traits, extend} = block
  let out = {}

  // Apply traits
  if (traits) {
    out = traits.reduce(applyTrait, out)
  }

  // Apply bases
  if (extend) {
    out = extend.reduce(applyBase, out)
  }

  // Filter extend and traits, which have been dealt with
  return {
    ...out,
    ...filterObject(block, ['*', '!extend'])
  }
}

// Can be passed to [].map to create multiple blocks
const createBlocks = () => createBlock

// Process block array to create new instances
var blocks = master.map(createBlocks())

console.log(blocks)

/**
 * Grabs the actual object representing a block
 */
export const getBlock = (id, block = {}) => {
  return {
    ...byKey(blocks, 'id'),
    ...block
  }
}

/**
 * Instance creator
 */
export const factory = {
  /**
   * Creates a new block
   */
  create (id) {
    // Creates a minimalist block, ready to store
    let block = getBlock(id)
    return {
      id,
      state: block.state || 0,
      light: 0
    }
  }
}
