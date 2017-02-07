
import ndarray from 'ndarray'
// import {compose} from 'lodash/fp'

import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'
import {GAME_STATES, BLOCK_STATES} from 'core/constants/game'
import {getById} from 'core/utils'
import {compare} from 'core/utils/ndarray'
import {hasMask} from 'core/utils/bitmask'
import {updateSightmap} from 'core/updates/visibility'
import monit from 'components/monit/monit'
import {get as getConfig} from 'core/service/config'
import {getBlock} from 'core/models/blocks'

const isSolid = cell => hasMask(cell.state)(BLOCK_STATES.SOLID)
const identity = cell => cell
const collision = cell => cell.onCollision

const performMove = (entity, moveTo, from, to) => {
  if (from.onExit) {
    from.onExit(entity, from)
  }

  entity.position = [moveTo[0], moveTo[1]]

  if (to.onEnter) {
    to.onEnter(entity, to)
  }
}

const updateMove = state => {
  let {map} = state
  let mat = ndarray(map.data, [map.width, map.height])
  // let isBlocker = compare(mat, isSolid)
  let getCell = compare(mat, identity)

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

    let desiredCell = getCell(...desired)
    let currentCell = getCell(...char.position)

    if (!desiredCell) {
      return false
    }

    let des = getBlock(desiredCell.id)
    let current = getBlock(currentCell.id)

    if (getConfig('no_block')) {
      performMove(char, desired, current, des)
      return true
    }

    if (isSolid(des)) {
      if (collision(des)) {
        collision(des)(char)
      }

      return false
    }

    performMove(char, desired, current, des)
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
      // {
      //   startAngle: 0,
      //   endAngle: Math.PI * 2,
      //   magnitude: 2,
      //   position: [2, 2]
      // },
      // {
      //   startAngle: Math.PI * -2,
      //   endAngle: Math.PI,
      //   magnitude: 3,
      //   position: [15, 0]
      // },
      // {
      //   startAngle: Math.PI * 0.5,
      //   endAngle: Math.PI * 1.5,
      //   magnitude: 3,
      //   position: [17, 10]
      // }
    ]

    let vision = {
      startAngle: 0,
      endAngle: Math.PI * 2,
      magnitude: 10,
      position: char.position
    }

    // Update light and visibility map
    // Tacking light on to map data here ensures it updates correctly
    state.map = updateSightmap(lights, vision)(state.map)

    monit.timeEnd('moving')

    return state
  }

  return state
})
