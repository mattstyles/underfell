
import {signal} from 'signals/main'
import {ACTIONS, GAME_STATES} from 'core/actions/global'

/**
 * Game running direction/movement key handler
 */
signal.register((state, event) => {
  if (state.gameState !== GAME_STATES.RUNNING) {
    return state
  }

  if (event.type === ACTIONS.KEYDOWN) {
    if (event.payload.key === '<up>') {
      state.position[1]++
    }

    if (event.payload.key === '<down>') {
      state.position[1]--
    }

    if (event.payload.key === '<left>') {
      state.position[0]--
    }

    if (event.payload.key === '<right>') {
      state.position[0]++
    }
    return state
  }

  return state
})
