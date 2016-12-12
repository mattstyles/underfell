
import Quay from 'quay'
import {fromEvent} from 'most'

import {signal} from 'signals/main'
import {ACTIONS, GAME_STATES} from 'core/actions/global'

let quay = new Quay()

const directionKeys = [
  '<up>',
  '<down>',
  '<left>',
  '<right>'
]

const keyFilter = event => {
  return directionKeys.reduce((flag, key) => {
    return quay.pressed.has(key)
      ? true
      : flag
  }, false)
}

const keyMap = event => {
  return directionKeys.reduce((e, key) => {
    return quay.pressed.has(key)
      ? {key}
      : e
  }, {key: null})
}

const eventStream = fromEvent('keydown', quay.stream('*'))
  .filter(keyFilter)
  .map(keyMap)
  .observe(event => {
    signal.emit({
      type: ACTIONS.KEYDOWN,
      payload: event
    })
  })

signal.register((state, event) => {
  if (state.game_state !== GAME_STATES.RUNNING) {
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
