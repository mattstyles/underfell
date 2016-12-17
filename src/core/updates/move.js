
import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {
  updateVisibility,
  clearVisibility,
  updateLightmap
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
      magnitude: 3,
      position: char.position
    }

    let vision = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 6,
      position: char.position
    }

    state.map = clearVisibility(state.map)
    state.map = updateLightmap(state.map, light)

    // Create test wall light
    state.map = updateLightmap(state.map, {
      startAngle: 0,
      endAngle: Math.PI,
      magnitude: 2,
      position: [8, 0]
    })

    state.map = updateVisibility(state.map, vision)

    // state.map = updateVisibility(state.map, char, [
    //   {
    //     startAngle: 0,
    //     endAngle: Math.PI * 2,
    //     magnitude: 4,
    //     position: char.position
    //   },
    //   // {
    //   //   startAngle: 0,
    //   //   endAngle: Math.PI,
    //   //   magnitude: 2,
    //   //   position: [8, 0]
    //   // }
    // ])

    return state
  }

  return state
})
