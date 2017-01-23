
import {signal} from 'signals/main'
import {generate} from 'core/service/map'
import {SIZES} from 'core/constants/game'
import {ACTIONS} from 'core/constants/actions'

signal.register((state, event) => {
  if (event.type === ACTIONS.KEYDOWN) {
    if (event.payload.key === 'g') {
      signal.emit({
        type: ACTIONS.GENERATE_MAP,
        payload: {
          key: (Math.random() * 1e6 | 0) + ''
        }
      })
    }

    return state
  }

  if (event.type === ACTIONS.GENERATE_MAP) {
    state.map = generate(SIZES.MAP_WIDTH, SIZES.MAP_HEIGHT, event.payload.key)
    return state
  }

  return state
})
