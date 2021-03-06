
import Quay from 'quay'
import {fromEvent} from 'most'

import {signal} from 'signals/main'
import {ACTIONS} from 'core/constants/actions'

let quay = new Quay()

const keyMap = {
  '<left>': '<left>',
  '<right>': '<right>',
  '<up>': '<up>',
  '<down>': '<down>',
  'A': '<left>',
  'D': '<right>',
  'W': '<up>',
  'S': '<down>'
}

const directionKeys = Object.keys(keyMap)

const getKey = key => ({key: keyMap[key]})

export const directionKeyFilter = event => {
  return directionKeys.reduce((flag, key) => {
    return quay.pressed.has(key)
      ? true
      : flag
  }, false)
}

export const directionKeyMap = event => {
  return directionKeys.reduce((e, key) => {
    return quay.pressed.has(key)
      ? getKey(key)
      : e
  }, {key: null})
}

/**
 * Turns key presses into a keydown event passing the vkey descriptor
 */
// fromEvent('keydown', quay.stream('*'))
//   .filter(directionKeyFilter)
//   .map(directionKeyMap)
//   .observe(event => {
//     signal.emit({
//       type: ACTIONS.DIRKEYDOWN,
//       payload: event
//     })
//   })

// Use a single stream to stop presses emitting multiple times
fromEvent('keydown', quay.stream('*'))
  .observe(event => {
    // Check for direction keys and emit specific value
    if (directionKeyFilter(event)) {
      signal.emit({
        type: ACTIONS.DIRKEYDOWN,
        payload: directionKeyMap(event)
      })
      return
    }

    // Emit key event
    signal.emit({
      type: ACTIONS.KEYDOWN,
      payload: {
        key: event.key,
        pressed: quay.pressed
      }
    })
  })
