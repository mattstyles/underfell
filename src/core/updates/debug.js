
import {signal} from 'signals/main'

if (window.localStorage.getItem('DEBUG_SIGNAL')) {
  signal.register((state, event) => {
    window.state = state
    console.groupCollapsed('@event', event.type)
    console.log('event', event)
    console.log('state', state)
    console.groupEnd()
    return state
  })
}
