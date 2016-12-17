
import keyMirror from 'core/utils/keyMirror'

export const GAME_STATES = keyMirror('STATE', [
  'RUNNING'
])

export const BLOCK_STATES = keyMirror('BLOCK_STATE', [
  'INVISIBLE',
  'DISCOVERED',
  'VISIBLE'
])

export const BLOCK_SIZE = {
  WIDTH: 9,
  HEIGHT: 16
}

export const VISIBILITY = {
  // Sets the visibility checks to centralise on a cell in the matrix
  ORIGIN_OFFSET: 0.5,

  // How frequently along the magnitude of the ray vector should we check
  // for visibility?
  RAY_MAG_INC: 1.1,

  // Defines how many rays to cast, i.e. 1 degree = 360 rays, more work but
  // greater accuracy
  RAY_ANGLE_INC: Math.PI / 180
}
