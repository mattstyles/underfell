
import {signal} from 'signals/main'

if (window.localStorage.getItem('DEBUG_SIGNAL')) {
  signal.register((state, event) => {
    console.groupCollapsed('@event', event.type)
    console.log('event', event)
    console.log('state', state)
    console.groupEnd()
    return state
  })
}
