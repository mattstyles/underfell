
import {signal} from 'signals/main'

signal.register((state, event) => {
  console.groupCollapsed('@event', event.type)
  console.log('event', event)
  console.log('state', state)
  console.groupEnd()
  return state
})
