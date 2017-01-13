
import {CHUNK_STATES, SIZES} from 'core/constants/game'
import {Rect} from 'core/utils'

/**
 * Creates a new chunk model
 */
export const factory = {
  create (options) {
    return {
      translate: [0, 0],
      state: CHUNK_STATES.CLEAN,
      ...options
    }
  }
}

/**
 * Sets the chunk as dirty
 */
export const makeDirty = chunk => {
  chunk.state = CHUNK_STATES.DIRTY
  return chunk
}

/**
 * Sets the chunk as clean, moving through transient on the way there
 */
export const makeClean = chunk => {
  chunk.state = chunk.state === CHUNK_STATES.DIRTY
    ? CHUNK_STATES.TRANSIENT
    : CHUNK_STATES.CLEAN
}

/**
 * Returns the chunk containing [x, y] from an array of chunks
 * @TODO this function can get super slow. The chunk array needs to be better
 * structured into [x, y] so that, given a cell [x, y], the algorithm can just
 * use array lookup to turn cell [x, y] into a chunk [x, y] rather than
 * creating Rect objects and performing the linear search (find).
 * A simple for loop might solve this well enough as .find is sloooow.
 */
export const getChunk = (chunks, x, y) => {
  return chunks.find(chunk => {
    let rect = new Rect([...chunk.translate], [
      chunk.translate[0] + SIZES.CHUNK_WIDTH,
      chunk.translate[1] + SIZES.CHUNK_HEIGHT
    ])
    return rect.containsPoint([x, y])
  })
}
