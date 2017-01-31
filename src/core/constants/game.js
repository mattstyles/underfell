
import keyMirror from 'core/utils/keyMirror'
import {bitmask} from 'core/utils/bitmask'

export const GAME_STATES = keyMirror('STATE', [
  'RUNNING'
])

export const BLOCK_STATES = bitmask([
  'DISCOVERED',
  'VISIBLE'
])

// font-size 14px, [9, 16]
export const SIZES = {
  CELL_WIDTH: 11,
  CELL_HEIGHT: 17,
  VIEWPORT_WIDTH: 24,
  VIEWPORT_HEIGHT: 12,
  MAP_WIDTH: 128,
  MAP_HEIGHT: 64
}

export const VISIBILITY = {
  // Sets the visibility checks to centralise on a cell in the matrix
  ORIGIN_OFFSET: 0.5,

  // How frequently along the magnitude of the ray vector should we check
  // for visibility? If visibility raises to a high number (just 15 is about
  // enough) this this magnitude scalar needs to be lowered so that the vis
  // check does not jump entire cells.
  RAY_MAG_INC: 1,

  // Defines how many rays to cast, i.e. 1 degree = 360 rays, more work but
  // greater accuracy
  RAY_ANGLE_INC: Math.PI / 180
}
