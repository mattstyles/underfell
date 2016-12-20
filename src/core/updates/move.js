
import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {
  updateVisibility,
  clearVisibility,
  updateLights
} from 'core/updates/visibility'

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

    let light = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 4,
      position: char.position
    }

    let dummyLight = {
      startAngle: Math.PI * -0.5,
      endAngle: Math.PI * 0.5,
      magnitude: 2,
      position: [0, 8]
    }

    let vision = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 10,
      position: char.position
    }

    // Clear the visibility and light data from the map
    state.map = clearVisibility(state.map)

    // Update the light map
    state.map = updateLights(state.map, [
      light,
      dummyLight
    ])

    // Update the visibility map
    state.map = updateVisibility(state.map, vision)

    return state
  }

  return state
})
