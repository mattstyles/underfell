
import ndarray from 'ndarray'
import {compose} from 'lodash/fp'

import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {compare} from 'core/utils/ndarray'
import {
  updateVisibility,
  clearVisibility,
  updateLights
} from 'core/updates/visibility'
import monit from 'components/monit/monit'
import {get as getConfig} from 'core/service/config'

const isSolid = cell => cell.isSolid

const updateMove = state => {
  let {map} = state
  let mat = ndarray(map.data, [map.width, map.height])
  let isBlocker = compare(mat, isSolid)

  return (key, char) => {
    let desired = [...char.position]

    if (key === '<up>') {
      desired[1]--
    }

    if (key === '<down>') {
      desired[1]++
    }

    if (key === '<left>') {
      desired[0]--
    }

    if (key === '<right>') {
      desired[0]++
    }

    // @TODO check if blocker has an onCollision handler
    if (isBlocker(...desired) && !getConfig('no_block')) {
      return false
    }

    char.position = [desired[0], desired[1]]

    return true
  }
}

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

    if (!updateMove(state)(event.payload.key, char)) {
      return state
    }

    monit.time('moving')

    var lights = [
      // Char light
      {
        startAngle: 0,
        endAngle: Math.PI * 2,
        magnitude: 6,
        position: char.position
      },
      // Wall lights
      {
        startAngle: 0,
        endAngle: Math.PI * 2,
        magnitude: 2,
        position: [2, 2]
      },
      {
        startAngle: Math.PI * -2,
        endAngle: Math.PI,
        magnitude: 3,
        position: [15, 0]
      },
      {
        startAngle: Math.PI * 0.5,
        endAngle: Math.PI * 1.5,
        magnitude: 3,
        position: [17, 10]
      }
    ]

    let vision = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 10,
      position: char.position
    }

    // @TODO use viewport to clamp cell updates

    // Update light and visibility map
    state.map = compose(
      updateVisibility(vision),
      updateLights(lights, vision),
      clearVisibility
    )(state.map)

    monit.timeEnd('moving')

    return state
  }

  return state
})
