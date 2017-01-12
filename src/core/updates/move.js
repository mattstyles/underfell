
import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES, CHUNK_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {
  updateVisibility,
  clearVisibility,
  updateLights
} from 'core/updates/visibility'
import monit from 'components/monit/monit'

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

    monit.time('moving')

    let light = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 5,
      position: char.position
    }

    let dummyLight = {
      startAngle: Math.PI * -0.5,
      endAngle: Math.PI * 0.5,
      magnitude: 2,
      position: [0, 1]
    }

    let vision = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 10,
      position: char.position
    }

    // @TODO use viewport to clamp cell updates

    // Clear the visibility and light data from the map
    state.map = clearVisibility(state.map)

    // Update the light map
    state.map = updateLights(state.map, [
      light,
      dummyLight
    ], vision)

    // Update the visibility map
    state.map = updateVisibility(state.map, vision)

    // How many dirty chunks?
    // console.log('dirty', state.map.chunks
    //   .filter(chunk => chunk.state === CHUNK_STATES.DIRTY))
    // console.log('transient', state.map.chunks.filter(chunk => chunk.state === CHUNK_STATES.TRANSIENT))

    monit.timeEnd('moving')

    return state
  }

  return state
})
