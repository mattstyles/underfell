
import {signal} from 'signals/main'
import {ACTIONS, GAME_STATES} from 'core/actions/global'

import {getEntityById} from 'core/utils/entities'

/**
 * Game running direction/movement key handler
 */
signal.register((state, event) => {
  if (state.gameState !== GAME_STATES.RUNNING) {
    return state
  }

  if (event.type === ACTIONS.KEYDOWN) {
    let char = getEntityById(state.entities, 'char')

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
    return state
  }

  return state
})
