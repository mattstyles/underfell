
import keyMirror from 'core/utils/keyMirror'

export const GAME_STATES = keyMirror('STATE', [
  'RUNNING'
])

export const BLOCK_STATES = keyMirror('BLOCK_STATE', [
  'INVISIBLE',
  'DISCOVERED',
  'VISIBLE'
])

export const CHUNK_STATES = keyMirror('CHUNK_STATE', [
  'CLEAN',
  'TRANSIENT',
  'DIRTY'
])

export const SIZES = {
  CELL_WIDTH: 9,
  CELL_HEIGHT: 16,
  VIEWPORT_WIDTH: 64,
  VIEWPORT_HEIGHT: 32,
  MAP_WIDTH: 128,
  MAP_HEIGHT: 64,
  CHUNK_WIDTH: 16,
  CHUNK_HEIGHT: 8
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
