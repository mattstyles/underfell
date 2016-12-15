
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
