
import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {updateVisibility, clearVisibility} from 'core/updates/visibility'

/**
 * Game running direction/movement key handler
 */
signal.register((state, event) => {
  if (state.gameState !== GAME_STATES.RUNNING) {
    return state
  }

  // Direction keys
  if (event.type === ACTIONS.DIRKEYDOWN) {
    let char = getById(state.entities, 'char')

    if (event.payload.key === '<up>') {
      char.position[1]--
    }

    if (event.payload.key === '<down>') {
      char.position[1]++
    }

    if (event.payload.key === '<left>') {
      char.position[0]--
    }

    if (event.payload.key === '<right>') {
      char.position[0]++
    }

    state.map = clearVisibility(state.map)
    state.map = updateVisibility(state.map, char)

    return state
  }

  return state
})
